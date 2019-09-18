'use strict'

const Controller = require('egg').Controller

class SyslogController extends Controller {
  async loglist() {
    const { ctx } = this
    const param = ctx.params
    // console.log(param, 'admin')
    const rt = await ctx.service.sys.list(param, 'users')

    if (rt.count === 1) {
      const user_id = rt.data[0].uuid

      const results = await ctx.service.sys.list({ user_id: user_id }, 'opt_log')

      ctx.body = {
        code: 20000,
        data: results.data,
        count: results.count,
        msg: '获取列表成功'
      }
    } else {
      ctx.body = {
        code: 60204,
        message: '用户错误'
      }
    }
  }

  async detail() {
    const { ctx } = this
    const param = ctx.params
    // console.log(param, 'admin')

    const results = await ctx.service.sys.list(param, 'opt_log')

    this.ctx.body = {
      code: 20000,
      data: results.data,
      count: results.count,
      msg: '获取列表成功'
    }
  }
}

module.exports = SyslogController
