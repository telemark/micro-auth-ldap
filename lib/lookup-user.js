'use strict'

const getUser = require('ldap-get-user')
const config = require('../config')

module.exports = data => {
  return new Promise((resolve, reject) => {
    const options = Object.assign({user: data.user}, config.LDAP)
    getUser(options)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}