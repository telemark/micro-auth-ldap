'use strict'

const config = require('../config')
const axios = require('axios')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)
const logger = require('./logger')

module.exports = async data => {
  const payload = {
    value: encryptor.encrypt(data)
  }

  logger(['save-session'])

  try {
    const result = await axios.post(config.SESSION_STORAGE_URL, payload)
    logger(['save-session', 'success', result.data.key])
    return result.data.key
  } catch (error) {
    logger(['save-session', 'error', error])
    throw error
  }
}
