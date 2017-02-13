'use strict'

const config = require('../config')
const axios = require('axios')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)

module.exports = data => {
  return new Promise((resolve, reject) => {
    const payload = {
      value: encryptor.encrypt(data)
    }
    axios.post(config.SESSION_STORAGE_URL, payload)
      .then(result => resolve(result.data))
      .catch(error => reject(error))
  })
}