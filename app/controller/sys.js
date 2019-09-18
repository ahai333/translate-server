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

  /**
   * // 开始工作,在opt_log表中添加一字段
   * 参数是用户名{username：'username'}
   */
  async startlog() {
    const { ctx } = this
    const param = ctx.params

    // console.log(param, 'startlog')
    const results = await ctx.service.sys.list(param, 'users')

    if (results.count === 1) {
      const user_id = results.data[0].uuid
      const param = {
        user_id: user_id,
        operate: 'similarity',
        starttime: new Date()
      }

      const result = await this.app.mysql.insert('opt_log', param) // 在 tablename 表中，插入 记录

      console.log(result, 'startlog1')

      // 判断插入成功
      const insertSuccess = result.affectedRows === 1
      if (insertSuccess === true) {
        let querydata = {
          where: { user_id: user_id },
          orders: [['starttime', 'desc']],
          limit: 1
        }
        const rt = await this.app.mysql.select('opt_log', querydata)
        if (rt.length === 1) {
          ctx.body = {
            code: 20000,
            data: { opt_id: rt[0].uuid },
            msg: '插入记录成功'
          }
        } else {
          ctx.body = {
            code: 50000,
            msg: '插入记录失败'
          }
        }
      } else {
        ctx.body = {
          code: 50000,
          msg: '插入记录失败'
        }
      }
    } else {
      ctx.body = {
        code: 50000,
        msg: '参数错误！'
      }
    }
  }
  /**
   * 操作结束，修改条目
   */
  async endlog() {
    const { ctx } = this
    const param = ctx.params
    const results = await ctx.service.sys.update(param, 'opt_log')
    ctx.body = {
      code: 20000,
      data: results.data,
      msg: results.msg
    }
  }
}
module.exports = SysController
