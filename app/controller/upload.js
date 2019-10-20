'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')
const sendToWormhole = require('stream-wormhole')
const awaitStreamReady = require('await-stream-ready').write

class UploadController extends Controller {
  async upimage() {
    const { ctx } = this
    // let { source, target, from, to, engine, opt_id } = ctx.params
    const stream = await ctx.getFileStream()
    // console.log(stream.filename, ctx.params.data, 'upimage')

    // 生成文件名
    const filename =
      Date.now() +
      '' +
      Number.parseInt(Math.random() * 10000) +
      path.extname(stream.filename)
    // 写入路径
    const target = path.join(
      //   this.config.baseDir,
      'E:/Src/translateTools/public/images',
      filename
    )
    const writeStream = fs.createWriteStream(target)
    try {
      // 写入文件
      await awaitStreamReady(stream.pipe(writeStream))
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream)
      throw err
    }
    const data = '/images/' + filename
    ctx.body = {
      code: 20000,
      data: data,
      msg: '上传成功!'
    }
  }
}

module.exports = UploadController
