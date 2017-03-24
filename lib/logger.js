'use strict'

const pkg = require('../package.json')

module.exports = (message) => {
  const now = new Date()
  const data = Array.isArray(message) ? message : [message]
  const logMessage = `${pkg.name} - ${pkg.version} - ${now.toUTCString()}: ${data.join(' - ')}`
  console.log(logMessage)
}
