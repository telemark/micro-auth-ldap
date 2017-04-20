'use strict'

const getUser = require('ldap-get-user')
const config = require('../config')
const logger = require('./logger')

module.exports = async data => {
  const options = Object.assign({user: data.userId}, config.LDAP)
  logger(['lookup', 'user', data.userId])
  try {
    const data = await getUser(options)
    logger(['lookup', 'user', data.userId, 'success'])
    return data
  } catch (error) {
    logger(['lookup', 'user', data.userId, 'error', error])
    throw error
  }
}
