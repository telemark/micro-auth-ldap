const readFileSync = require('fs').readFileSync
const jwt = require('jsonwebtoken')
const marked = require('marked')
const { parse } = require('url')
const { json, send } = require('micro')
const config = require('./config')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)
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
      logger('error', ['index', 'auth', error])
      const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error'
      const em = /80090308/.test(errorMessage) ? 'Ugyldig brukernavn eller passord' : encodeURIComponent(errorMessage)
      const url = `/login?origin=${data.origin}${addNextPath(data)}&error=${em}`
      response.writeHead(302, { Location: url })
      response.end()
    }
  } else if (pathname === '/lookup') {
    logger('info', ['index', 'lookup', 'start'])
    const receivedToken = query.jwt || request.headers.authorization
    if (receivedToken) {
      logger('info', ['index', 'lookup', 'got token'])
      jwt.verify(receivedToken, config.JWT_SECRET, async (error, decoded) => {
        if (error) {
          logger('error', ['index', 'lookup', error])
          send(response, 500, error)
        } else {
          try {
            logger('info', ['index', 'lookup', 'token ok'])
            const decrypted = encryptor.decrypt(decoded.data)
            const result = await lookupUser(decrypted)
            logger('info', ['index', 'lookup', 'user found', 'success'])
            send(response, 200, {data: encryptor.encrypt(result)})
          } catch (error) {
            logger('error', ['index', 'jwt', 'lookup', 'error', error])
            send(response, 500, error)
          }
        }
      })
    } else {
      logger('error', ['index', 'lookup', 'missing jwt', 'error'])
      send(response, 500, new Error('missing jwt'))
    }
  } else if (query.jwt) {
    logger('info', ['index', 'jwt', 'received jwt'])
    const receivedToken = query.jwt
    jwt.verify(receivedToken, config.JWT_SECRET, async (error, data) => {
      if (error) {
        logger('error', ['index', 'jwt', 'error', error])
        send(response, 500, error)
      } else {
        try {
          const result = await lookupUser(data)
          const session = await saveSession(result)
          const jwt = generateJwt(Object.assign({sessionKey: session}, result))
          const url = `${data.origin}?jwt=${jwt}${addNextPath(query)}`
          logger('info', ['index', 'jwt', 'success'])
          response.writeHead(302, { Location: url })
          response.end()
        } catch (error) {
          logger('error', ['index', 'jwt', 'lookup-and-save', error])
          send(response, 500, error)
        }
      }
    })
  } else if (pathname === '/login') {
    const data = request.method === 'POST' ? await json(request) : query
    if (data.origin) {
      logger('info', ['index', 'login', 'origin', data.origin])
      response.setHeader('Content-Type', 'text/html')
      send(response, 200, loginPage(data))
    } else {
      logger('error', ['index', 'login', 'missing origin'])
      send(response, 500, {error: 'missing required param: origin'})
    }
  } else if (pathname === '/logout') {
    const data = request.method === 'POST' ? await json(request) : query
    if (data.origin) {
      logger('info', ['index', 'logout', 'origin', data.origin])
      response.writeHead(302, { Location: data.origin })
      response.end()
    } else if (process.env.REDIRECT_LOGOUT_URL) {
      logger('info', ['index', 'logout', 'redirUrl', process.env.REDIRECT_LOGOUT_URL])
      response.writeHead(302, { Location: process.env.REDIRECT_LOGOUT_URL })
      response.end()
    } else {
      logger('info', ['index', 'logout', 'missing origin', 'missing redirUrl'])
      send(response, 200, {logout: true})
    }
  } else {
    response.setHeader('Content-Type', 'text/html')
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
