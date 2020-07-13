#!/usr/bin/env node
const http = require('http')
const {hostname} = require('os')
const {promisify} = require('util')
const lookup = promisify(require('dns').lookup)

const getLocalIp = async () => {
  let {address} = await lookup(hostname())
  console.log('local:', address)
}

const getPublicIp = async () => {
  await new Promise((resolve, reject) => {
    const options = {
      hostname: 'ipinfo.io',
      path: '/ip',
      method: 'GET',
    }
    const req = http.request(options, (res) => {
      res.on('end', resolve)
      res.on('data', ip => console.log('public:', ip.toString().trim()))
    })
    req.on('error', reject)
    req.end()
  })
}

const main = async () => {
  await getLocalIp()
  await getPublicIp()
}

main()
.catch((e) => {
  console.log(e)
  process.exit(1)
})
