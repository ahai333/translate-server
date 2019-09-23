'use strict'

const Controller = require('egg').Controller

class SyslogController extends Controller {
  /**
   * param：{user_id: '2', tablename: 'similarity_log'}
   */
  async list() {
    const { ctx } = this
    const param = ctx.params
    console.log(param, 'list')
    const rt = await ctx.service.sys.list({ uuid: param.user_id }, 'users')

    if (rt.count === 1) {
      const user_id = rt.data[0].uuid

      const results = await ctx.service.sys.list(
        { user_id: user_id },
        param.tablename
      )

      console.log(results.data, 'list1')
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
  /**
   * param: { opt_id: opt_id, tablename: 'similarity_log' }
   */
  async detail() {
    const { ctx } = this
    const param = ctx.params

    if (
      typeof param.opt_id !== 'undefined' &&
      typeof param.tablename !== 'undefined'
    ) {
      const results = await ctx.service.sys.list(
        { opt_id: param.opt_id },
        param.tablename
      )

      ctx.body = {
        code: 20000,
        data: results.data,
        count: results.count,
        msg: '获取列表成功'
      }
    } else {
      ctx.body = {
        code: 50000,
        msg: '获取列表失败'
      }
    }
  }
}

module.exports = SyslogController
