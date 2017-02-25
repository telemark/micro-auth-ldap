'use strict'

const fs = require('fs')

module.exports = data => {
  const html = fs.readFileSync('lib/login.html', 'utf-8')

  return html.replace('{{origin}}', data.origin)
}
