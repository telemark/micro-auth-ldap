'use strict'

const getUser = require('ldap-get-user')
const config = require('../config')
const logger = require('./logger')

module.exports = async data => {
  const options = Object.assign({user: data.userName}, config.LDAP)
  logger(['lookup', 'user', data.userName])
  try {
    const data = await getUser(options)
    logger(['lookup', 'user', data.userName, 'success'])
    return data
  } catch (error) {
    logger(['lookup', 'user', data.userName, 'error', error])
    throw error
  }
}
