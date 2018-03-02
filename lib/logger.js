const config = require('../config')
const pkg = require('../package.json')
const winston = require('winston')
require('winston-papertrail').Papertrail // eslint-disable-line no-unused-expressions

function getPapertrail () {
  return process.env.NODE_ENV !== 'production' ? {} : new winston.transports.Papertrail({
    host: config.PAPERTRAIL_HOST,
    port: config.PAPERTRAIL_PORT,
    hostname: config.PAPERTRAIL_HOSTNAME,
    logFormat: (level, message) => `${level.toUpperCase()} - ${message || ''}`
  })
}

const winstonPapertrail = getPapertrail()

const winstonConsole = new winston.transports.Console({
  formatter: options => `${new Date().toUTCString()} - ${options.level.toUpperCase()} - ${(options.message ? options.message : '')}`
})

const winstonTransports = process.env.NODE_ENV !== 'production' ? [winstonConsole] : [winstonConsole, winstonPapertrail]

const logger = new (winston.Logger)({
  transports: winstonTransports
})

module.exports = (level, message) => {
  const data = Array.isArray(message) ? message : [message]
  const logMessage = `${pkg.name} - ${pkg.version}: ${data.join(' - ')}`
  return logger.log(level, logMessage)
}
