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

module.exports = async (request, response) => {
  const {pathname, query} = await parse(request.url, true)
  if (pathname === '/auth') {
    const data = request.method === 'POST' ? await bodyParser(request) : query
    try {
      const result = await loginUser(data)
      result.nextPath = query.nextPath || ''
      const session = await saveSession(result)
      const jwt = generateJwt(Object.assign({sessionKey: session}, result))
      const url = `${data.origin}?jwt=${jwt}`
      response.writeHead(302, { Location: url })
      response.end()
    } catch (error) {
      response.writeHead(302, { Location: `/login?origin=${data.origin}&nextPath=${query.nextPath || ''}` })
    }
  } else if (query.jwt) {
    const receivedToken = query.jwt
    jwt.verify(receivedToken, config.JWT_SECRET, async (error, data) => {
      if (error) {
        send(response, 500, error)
      } else {
        const result = await lookupUser(data)
        result.nextPath = query.nextPath || ''
        const session = await saveSession(result)
        const jwt = generateJwt(Object.assign({sessionKey: session}, result))
        const url = `${data.origin}?jwt=${jwt}`
        response.writeHead(302, { Location: url })
        response.end()
      }
    })
  } else if (pathname === '/login') {
    const data = request.method === 'POST' ? await json(request) : query
    if (data.origin) {
      response.setHeader('Content-Type', 'text/html')
      send(response, 200, loginPage(data))
    } else {
      send(response, 500, {error: 'missing required param: origin'})
    }
  } else {
    response.setHeader('Content-Type', 'text/html')
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
