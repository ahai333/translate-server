'use strict'

const Controller = require('egg').Controller

class TableController extends Controller {
  // 获取加班记录
  async records() {
    const { ctx } = this
    const param = ctx.params
    let { name, daterang, depart } = ctx.params

    console.log(ctx.params, 'records')

    let sqlstring = 'select * from tb_order '
    if (name != '' || daterang != '' || depart != '') {
      sqlstring = sqlstring + ' where '
      if (name != '') {
        sqlstring = sqlstring + ` Uname = '${name}' and `
      }
      if (daterang != '') {
        sqlstring =
          sqlstring +
          ` StartTime > '${daterang[0]}' and StartTime < '${daterang[1]}' and `
      }
      if (depart != '') {
        sqlstring = sqlstring + ` Dept = '${depart}' `
      } else {
        sqlstring = sqlstring.substring(0, sqlstring.length - 4)
      }
    }

    const results = await this.app.mysql.query(sqlstring)
    //  console.log(results)

    // 转换格式
    for (let i = 0; i < results.length; i++) {
      results[i].StartTime = results[i].StartTime.toLocaleString()
      results[i].EndTime = results[i].EndTime.toLocaleString()
      results[i].duration = ctx.helper.getduration(results[i].duration)
    }

    ctx.body = {
      code: 20000,
      data: results,
      msg: `获取${results.length}条加班记录`
    }
  }
  // 获取部门列表
  async getdepts() {
    const { ctx } = this

    const results = await ctx.service.query.getdepts()

    this.ctx.body = {
      code: 20000,
      data: results.departs,
      count: results.count,
      msg: '获取部门列表成功'
    }
  }

  // 获取人员列表
  async getnames() {
    const { ctx } = this

    let names = await ctx.service.query.getnames(ctx.params.depart)

    this.ctx.body = {
      code: 20000,
      data: names,
      msg: '获取人员列表成功'
    }
  }

  // 获取加班人员列表
  async workinglist() {
    const { ctx } = this

    const { depart } = ctx.params

    let results = await ctx.service.query.workinglist(depart)

    this.ctx.body = {
      code: 20000,
      data: results,
      msg: '获取加班人员列表成功'
    }
  }
}

module.exports = TableController
