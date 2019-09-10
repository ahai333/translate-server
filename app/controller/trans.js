'use strict'

const Controller = require('egg').Controller
const { youdao, baidu, google } = require('translation.js')

class TransController extends Controller {
  async test() {
    const { ctx } = this
    const { engine, data, from, to } = ctx.params
    console.log(ctx.params)

    let params = { text: data, from: from, to: to }

    let ret = ''
    let code = 20000
    switch (engine) {
      case 'google':
        ret = await google.translate(params)
        break
      case 'baidu':
        ret = await baidu.translate(params)
        break
      case 'youdao':
        ret = await youdao.translate(params)
        break
      case 'google(com)':
        params.com = true
        ret = await google.translate(params)
        break
      default:
        ret = await google.translate(params)
        // code = 50000
        break
    }
    console.log(ret, 'translate')

    if (code == 20000) {
      if (typeof ret.result != 'undefined') {
        ctx.body = {
          code: 20000,
          data: {
            text: ret.result,
            from: ret.from,
            to: ret.to
          }
        }
      } else {
        // NETWORK_ERROR - 网络错误，可能是运行环境没有网络连接造成的
        // API_SERVER_ERROR - 翻译接口返回了错误的数据
        // UNSUPPORTED_LANG - 接口不支持的语种
        // NETWORK_TIMEOUT - 查询接口时超时了
        ctx.body = {
          code: 50008,
          msg: ret.code
        }
      }
    } else {
      ctx.body = {
        code: code,
        msg: '翻译引擎参数错误!'
      }
    }
    console.log(ctx.body)
  }

  /**
   * 字符串匹配率
   */
  async match() {
    const { ctx } = this
    let { source, target } = ctx.params
    source = 'this is a -123456.8 good, person'
    target = 'this is a +1234.99 bad, person'
    let ret = await ctx.service.matchQuality.similarity(source, target)
    // console.log(ret, 'ret')

    // let ret = matchq.similarity('this is a test', 'this is the test')
    ctx.body = {
      code: ret,
      msg: '计算匹配率!'
    }
  }

  /**
   * 字符串匹配率
   */
  async quality() {
    const { ctx } = this
    let { source, target, from, to, engine } = ctx.params
    let ret = await ctx.service.matchQuality.trans(source, from, to, engine)
    if (ret.code === 20000) {
      let trans = ''
      ret.target.forEach(ret => {
        trans += ret + ' '
      })
      let q = await ctx.service.matchQuality.similarity(target, trans)
      // console.log(ret, 'ret')

      // let ret = matchq.similarity('this is a test', 'this is the test')
      ctx.body = {
        code: 20000,
        data: { text: trans, quality: q.toFixed(3) },
        msg: '计算匹配率成功!'
      }
    } else {
      ctx.body = {
        code: 50000,
        data: q.target,
        msg: '计算匹配率!'
      }
    }
  }
}

module.exports = TransController
