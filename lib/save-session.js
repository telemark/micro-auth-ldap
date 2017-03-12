'use strict'

const config = require('../config')
const axios = require('axios')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)

module.exports = async data => {
  const payload = {
    value: encryptor.encrypt(data)
  }

  try {
    const result = await axios.post(config.SESSION_STORAGE_URL, payload)
    return result.data.key
  } catch (error) {
    throw error
  }
}
