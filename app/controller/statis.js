'use strict'

const Controller = require('egg').Controller

class StatisController extends Controller {
  async total() {
    const { ctx } = this
    const { daterange } = ctx.params
    console.log(daterange, 'total')

    const valid = 1
    // todo 判断参数合法
    // valid  = checkparam(daterange)

    if (valid) {
      //
      const data = await ctx.service.statis.total(daterange)
      console.log(data,'data')
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
    console.log(ctx.body)
  }
  async detail() {}
}

module.exports = StatisController
