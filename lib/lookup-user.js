const getUser = require('ldap-get-user')
const config = require('../config')
const logger = require('./logger')

module.exports = async data => {
  const options = Object.assign({ user: data.userId }, config.LDAP)
  logger('info', ['lookup-user', 'user', data.userId])
  try {
    const data = await getUser(options)
    logger('info', ['lookup-user', 'user', data.userId, 'success'])
    return data
  } catch (error) {
    logger('error', ['lookup-user', 'user', data.userId, error])
    throw error
  }
}
