'use strict'

const Controller = require('egg').Controller

class StatisController extends Controller {
  // 只提供查询2018年以后的数据

  async total() {
    const { ctx } = this
    const { daterange } = ctx.params

    const valid = 1
    // todo 判断参数合法
    // valid  = checkparam(daterange)
    if (typeof daterange[0] == 'undefined' || daterange[0] == '') {
      daterange[0] = new Date(2018, 1, 1, 0, 0, 0, 0)
    }
    if (typeof daterange[1] == 'undefined' || daterange[1] == '') {
      daterange[1] = new Date()
    }
    console.log(daterange, 'total')

    if (valid) {
      //
      const data = await ctx.service.statis.total(daterange)
      console.log(data, 'data')
      ctx.body = {
        code: 20000,
        data: data,
        msg: '统计成功！'
      }
    } else {
      ctx.body = {
        code: 50000,
        msg: '参数错误!'
      }
    }
  }
  // 统计每个部门人员加班情况
  async detail() {
    const { ctx } = this
    const { depart, daterange } = ctx.params
    if (depart == '' || typeof depart == 'undefined') {
      ctx.body = {
        code: 50000,
        msg: '参数错误!'
      }
    } else {
      if (typeof daterange[0] == 'undefined' || daterange[0] == '') {
        daterange[0] = new Date(2018, 1, 1, 0, 0, 0, 0)
      }
      if (typeof daterange[1] == 'undefined' || daterange[1] == '') {
        daterange[1] = new Date()
      }
      const ret = await ctx.service.statis.detail(depart, daterange)
      ctx.body = {
        code: 20000,
        data: ret,
        msg: '统计成功！'
      }

      console.log(ret)
    }
  }
}

module.exports = StatisController
