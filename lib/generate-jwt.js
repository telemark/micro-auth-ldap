'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)

module.exports = data => {
  const tokenOptions = {
    expiresIn: '1h',
    issuer: 'https://auth.t-fk.no'
  }
  const tokenData = {
    data: encryptor.encrypt({
      userName: data.displayName || data.cn,
      userId: data.sAMAccountName || data.uid || '',
      session: data.sessionKey
    })
  }
  const token = jwt.sign(tokenData, config.JWT_SECRET, tokenOptions)
  return token
}
