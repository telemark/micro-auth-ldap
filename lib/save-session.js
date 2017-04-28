'use strict'

const config = require('../config')
const axios = require('axios')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)
const logger = require('./logger')

module.exports = async data => {
  const payload = {
    value: encryptor.encrypt(data)
  }

  logger('info', ['save-session'])

  try {
    const result = await axios.post(config.SESSION_STORAGE_URL, payload)
    logger('info', ['save-session', 'success', result.data.key])
    return result.data.key
  } catch (error) {
    logger('error', ['save-session', error])
    throw error
  }
}
