'use strict'

const config = require('../config')
const LdapAuth = require('ldapauth-fork')

module.exports = data => {
  return new Promise((resolve, reject) => {
    const auth = new LdapAuth(config.LDAP)

    auth.on('error', err => {
      console.error('LdapAuth: ', err)
      reject(err)
    })

    auth.authenticate(data.username, data.password, (error, user) => {
      if (error) {
        reject(error)
      } else {
        auth.close(err => {
          if (err) {
            console.error(err)
            resolve(user)
          } else {
            resolve(user)
          }
        })
      }
    })
  })
}
