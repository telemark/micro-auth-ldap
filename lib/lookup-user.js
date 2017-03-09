'use strict'

const getUser = require('ldap-get-user')
const config = require('../config')

module.exports = async data => {
  const options = Object.assign({user: data.userName}, config.LDAP)
  try {
    const data = await getUser(options)
    return data
  } catch (error) {
    throw error
  }
}
