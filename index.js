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
    const result = await loginUser(data)
    const session = await saveSession(result)
    const jwt = generateJwt(Object.assign({sessionKey: session}, result))
    const url = `${data.redirectUrl}?jwt=${jwt}`
    response.writeHead(301, { Location: url })
    response.end()
  } else if (query.jwt) {
    const receivedToken = query.jwt
    jwt.verify(receivedToken, config.JWT_SECRET, async (error, data) => {
      if (error) {
        send(response, 500, error)
      } else {
        const result = await lookupUser(data)
        const session = await saveSession(result)
        const jwt = generateJwt(Object.assign({sessionKey: session}, result))
        const url = `${data.redirectUrl}?jwt=${jwt}`
        response.writeHead(301, { Location: url })
        response.end()
      }
    })
  } else if (pathname === '/login') {
    const data = request.method === 'POST' ? await json(request) : query
    send(response, 200, loginPage(data))
  } else {
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
