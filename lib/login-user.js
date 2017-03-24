'use strict'

const LdapAuth = require('ldapauth-fork')
const logger = require('./logger')
const config = require('../config')

module.exports = data => {
  return new Promise((resolve, reject) => {
    const auth = new LdapAuth(config.LDAP)

    logger(['login', 'user', data.username])

    auth.on('error', err => {
      logger(['LadapAuth', 'user', data.username, err])
      reject(err)
    })

    auth.authenticate(data.username, data.password, (error, user) => {
      if (error) {
        logger(['login', 'user', data.username, 'error', error])
        reject(error)
      } else {
        auth.close(err => {
          if (err) {
            logger(['login', 'user', data.username, 'auth.close', 'error', err])
            resolve(user)
          } else {
            logger(['login', 'user', data.username, 'success'])
            resolve(user)
          }
        })
      }
    })
  })
}
