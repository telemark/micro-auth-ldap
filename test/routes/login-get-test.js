'use strict'

const test = require('ava')
const listen = require('test-listen')
const axios = require('axios')
const micro = require('micro')
const srv = require('../../index')

const getUrl = fn => {
  const srv = micro(fn)
  return listen(srv)
}

test('it returns error if origin is missing', async t => {
  const url = await getUrl(srv)
  axios.get(`${url}/login`).catch(error => {
    t.truthy(error)
    t.true(error.response.status, 500, 'Error ok')
  })
})

test('it returns origin if supplied', async t => {
  const origin = 'https://www.example.com'
  const url = await getUrl(srv)
  const result = await axios.get(`${url}/login?origin=${origin}`)
  t.true(result.data.includes(origin), 'Origin ok')
})
