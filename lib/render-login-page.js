'use strict'

const fs = require('fs')

module.exports = data => {
  if (!data.origin) {
    throw new Error('Missing required input: origin')
  }
  const html = fs.readFileSync('lib/login.html', 'utf-8')

  return html.replace('{{origin}}', data.origin)
}
