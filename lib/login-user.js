'use strict'

const config = require('../config')
const LdapAuth = require('ldapauth-fork')
const auth = new LdapAuth(config.LDAP)

module.exports = data => {
  return new Promise((resolve, reject) => {
    auth.authenticate(data.username, data.password, (error, user) => {
      if (error) {
        reject(error)
      } else {
        resolve(user)
      }
    })
  })
}
