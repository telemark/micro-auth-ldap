'use strict'

const LdapAuth = require('ldapauth-fork')
const logger = require('./logger')
const config = require('../config')

module.exports = data => {
  return new Promise((resolve, reject) => {
    const auth = new LdapAuth(config.LDAP)

    logger('info', ['login-user', 'user', data.username])

    auth.on('error', err => {
      logger('error', ['login-user', 'user', data.username, err])
      reject(err)
    })

    auth.authenticate(data.username, data.password, (error, user) => {
      if (error) {
        logger('error', ['login-user', 'authenticate', 'user', data.username, error])
        reject(error)
      } else {
        auth.close(err => {
          if (err) {
            logger('error', ['login-user', 'close', 'user', data.username, 'auth.close', 'error', err])
            resolve(user)
          } else {
            logger('info', ['login-user', 'authenticate', 'user', data.username, 'success'])
            resolve(user)
          }
        })
      }
    })
  })
}
