'use strict'

const Controller = require('egg').Controller

class SysController extends Controller {
  async admin() {
    const { ctx } = this
    const param = ctx.params
    console.log(param, 'admin')

    const results = await ctx.service.sys.list(param, 'users')

    this.ctx.body = {
      code: 20000,
      data: results.data,
      count: results.count,
      msg: '获取列表成功'
    }
  }

  async modifyadmin() {
    const { ctx } = this
    const param = ctx.params
    let valid = true
    // 添加用户
    if (param.uuid === 0) {
      valid = await ctx.service.sys.valid(
        { username: param.username },
        'users',
        param.uuid
      )
    }
    if (valid === true) {
      const results = await ctx.service.sys.modify(param, 'users')
      ctx.body = {
        code: 20000,
        data: results.data,
        msg: results.msg
      }
    } else {
      ctx.body = {
        code: 20000,
        data: false,
        msg: '用户名已存在！'
      }
    }
  }

  /**
   * 删除记录
   * params是 uuid数组
   */

  async deladmin() {
    const { ctx } = this
    const param = ctx.params
    let count = 0
    for (let i in param) {
      count += await ctx.service.sys.del('users', { uuid: param[i] })
    }
    ctx.body = {
      code: 20000,
      msg: '删除了' + count + '条记录'
    }
  }
}
module.exports = SysController
