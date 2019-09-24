'use strict'

const Controller = require('egg').Controller

class SimilarityController extends Controller {
  async do() {
    const { ctx } = this
    let { source, target, from, to, engine, opt_id } = ctx.params
    let ret = await ctx.service.sys.trans(source, from, to, engine)

    if (ret.code === 20000) {
      let trans = ''
      ret.target.forEach(text => {
        trans += text + ' '
      })
      let q1 = await ctx.service.similarity.calc(target, trans, 'lcs')
      let q2 = await ctx.service.similarity.calc(target, trans, 'levenshtein')
      let q3 = await ctx.service.similarity.calc(target, trans, 'simhash')
      let p = ((1 * source.length) / target.length).toFixed(4)

      // 写详细日志，similarity_detail表中
      let param = {
        opt_id: opt_id,
        source: source,
        sourcelen: source.length,
        target: target,
        targetlen: target.length,
        mt: trans,
        mtlen: trans.length,
        similarity: q1,
        similarity2: q2,
        similarity3: q3,
        remarks: p.toString()
      }
      const res = await ctx.service.sys.insert(param, 'similarity_detail')

      ctx.body = {
        code: 20000,
        data: { text: trans, similarity: q1, similarity2: q2, similarity3: q3 },
        msg: '计算相似度成功!'
      }
    } else {
      ctx.body = {
        code: 50000,
        msg: '计算相似度失败!'
      }
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
        // operate: 'similarity',
        starttime: new Date()
      }

      const result = await this.app.mysql.insert('similarity_log', param) // 在 tablename 表中，插入 记录

      // 判断插入成功
      const insertSuccess = result.affectedRows === 1
      if (insertSuccess === true) {
        let querydata = {
          where: { user_id: user_id },
          orders: [['starttime', 'desc']],
          limit: 1
        }
        const rt = await this.app.mysql.select('similarity_log', querydata)
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
    let param = ctx.params
    param.endtime = new Date()
    const results = await ctx.service.sys.update(param, 'similarity_log')
    ctx.body = {
      code: 20000,
      data: results.data,
      msg: results.msg
    }
  }
}

module.exports = SimilarityController
