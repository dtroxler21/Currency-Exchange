/* eslint-env jest */
'use strict'

const http = require('http')

const req = require('./')
let server

beforeAll(() => {
  server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('Responded')
  })
  server.listen(5000)
})

test('should export single function', () => {
  expect(req).toBeDefined()
  expect(typeof req).toBe('function')
})

test('should make GET request', async () => {
  const res = await req({ url: 'http://localhost', port: 5000 })
  expect(res.body).toBe('Responded')
})

test('should make POST request', async () => {
  const res = await req({ url: 'http://localhost', port: 5000, method: 'POST' })
  expect(res.body).toBe('Responded')
})

afterAll(() => {
  server.close()
})
