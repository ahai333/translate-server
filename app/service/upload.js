'use strict'

const Service = require('egg').Service
const fs = require('fs')

class UploadService extends Service {
  async upImag(data) {
    const { app } = this
    // return data
    var dataBuffer = Buffer.from(data.base64 + '', 'base64')
    fs.writeFile(`app/public/${data.id}.png`, dataBuffer, function(err) {
      if (err) {
        console.log(err)
      }
    })
    return `http://localhost:7001/public/${data.id}.png`
  }
}

module.exports = UploadService
