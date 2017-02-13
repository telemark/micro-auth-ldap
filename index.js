'use strict'

const readFileSync = require('fs').readFileSync
const marked = require('marked')
const { parse } = require('url')
const { json, send } = require('micro')
const bodyParser = require('urlencoded-body-parser')
const loginPage = require('./lib/render-login-page')
const lookupUser = require('./lib/lookup-user')
const saveSession = require('./lib/save-session')

module.exports = async (request, response) => {
  const {pathname, query} = await parse(request.url, true)
  if (pathname === '/auth') {
    const data = request.method === 'POST' ? await bodyParser(request) : parse(request.url, true).query
    send(response, 200, data)
  } else if (pathname === '/lookup') {
    const data = request.method === 'POST' ? await json(request) : parse(request.url, true).query
    const result = await lookupUser(data)
    const session = await saveSession(result)
    send(response, 200, session)
  } else if (pathname === '/login') {
    send(response, 200, loginPage(data))
  } else {
    const readme = readFileSync('./README.md', 'utf-8')
    const html = marked(readme)
    send(response, 200, html)
  }
}
