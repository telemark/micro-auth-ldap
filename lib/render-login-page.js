'use strict'

const fs = require('fs')

module.exports = data => {
  if (!data.origin) {
    throw new Error('Missing required input: origin')
  }
  let html = fs.readFileSync('lib/login.html', 'utf-8')
  html = html.replace('{{origin}}', data.origin)
  html = html.replace('{{nextPath}}', data.nextPath || '')
  return html
}
