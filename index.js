'use strict'

const readFileSync = require('fs').readFileSync
const jwt = require('jsonwebtoken')
const marked = require('marked')
const { parse } = require('url')
const { json, send } = require('micro')
const config = require('./config')
const bodyParser = require('urlencoded-body-parser')
const loginPage = require('./lib/render-login-page')
const lookupUser = require('./lib/lookup-user')
const saveSession = require('./lib/save-session')
const loginUser = require('./lib/login-user')
const generateJwt = require('./lib/generate-jwt')
const logger = require('./lib/logger')

function addNextPath (data) {
  let nextPath = ''
  if (data.nextPath && data.nextPath.length > 0) {
    nextPath = `&nextPath=${data.nextPath}`
  }
  return nextPath
}

module.exports = async (request, response) => {
  const {pathname, query} = await parse(request.url, true)
  if (pathname === '/auth') {
    const data = request.method === 'POST' ? await bodyParser(request) : query
    try {
      const result = await loginUser(data)
      const session = await saveSession(result)
      const jwt = generateJwt(Object.assign({sessionKey: session}, result))
      const url = `${data.origin}?jwt=${jwt}${addNextPath(data)}`
      response.writeHead(302, { Location: url })
      response.end()
    } catch (error) {
      logger(['index', 'auth', 'error', error])
      const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error'
      const em = /80090308/.test(errorMessage) ? 'Ugyldig brukernavn eller passord' : encodeURIComponent(errorMessage)
      const url = `/login?origin=${data.origin}${addNextPath(data)}&error=${em}`
      response.writeHead(302, { Location: url })
      response.end()
    }
  } else if (pathname === '/lookup') {
    const receivedToken = query.jwt || request.headers.authorization
    if (receivedToken) {
      jwt.verify(receivedToken, config.JWT_SECRET, async (error, data) => {
        if (error) {
          logger(['index', 'lookup', 'error', error])
          send(response, 500, error)
        } else {
          try {
            const result = await lookupUser(data)
            logger(['index', 'lookup', 'user found', 'success'])
            send(response, 200, result)
          } catch (error) {
            logger(['index', 'jwt', 'lookup', 'error', error])
            send(response, 500, error)
          }
        }
      })
    } else {
      logger(['index', 'lookup', 'missing jwt', 'error'])
      send(response, 500, new Error('missing jwt'))
    }
  } else if (query.jwt) {
    const receivedToken = query.jwt
    jwt.verify(receivedToken, config.JWT_SECRET, async (error, data) => {
      if (error) {
        logger(['index', 'jwt', 'error', error])
        send(response, 500, error)
      } else {
        try {
          const result = await lookupUser(data)
          const session = await saveSession(result)
          const jwt = generateJwt(Object.assign({sessionKey: session}, result))
          const url = `${data.origin}?jwt=${jwt}${addNextPath(query)}`
          response.writeHead(302, { Location: url })
          response.end()
        } catch (error) {
          logger(['index', 'jwt', 'lookup-and-save', 'error', error])
          send(response, 500, error)
        }
      }
    })
  } else if (pathname === '/login') {
    const data = request.method === 'POST' ? await json(request) : query
    if (data.origin) {
      response.setHeader('Content-Type', 'text/html')
      send(response, 200, loginPage(data))
    } else {
      logger(['index', 'login', 'error', 'missing origin'])
      send(response, 500, {error: 'missing required param: origin'})
    }
  } else {
    response.setHeader('Content-Type', 'text/html')
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
