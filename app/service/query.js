'use strict'

const Service = require('egg').Service

class QueryService extends Service {
  async getdepts() {
    const { ctx } = this
    const results = await this.app.mysql.select('tb_dept')
    let departs = []
    let count = []

    for (let i = 0; i < results.length; i++) {
      departs.push(results[i].Dept)
      let names = await ctx.service.query.getnames(results[i].Dept)
      count.push(names.length)
    }
    return { departs: departs, count: count }
  }
  async getnames(depart = '') {
    const { ctx } = this
    let results = {}
    if (depart == '' || depart == 'undefined') {
      results = await this.app.mysql.select('tb_user')
    } else {
      let querydata = {
        where: { Dept: depart }
      }
      results = await this.app.mysql.select('tb_user', querydata)
    }
    let names = []
    results.forEach(record => {
      names.push(record.Uname)
    })

    return names
  }
  async workinglist(depart = '') {
    const { ctx } = this

    const curtime = new Date()
    const starttime = new Date(curtime - 10 * 60 * 60 * 1000)
    let sqlstring = 'select * from tb_order where StartTime = EndTime and '
    if (depart != '' && typeof depart != 'undefined') {
      sqlstring += ` Dept = '${depart}' and `
    } else {
      sqlstring += ` StartTime > '${starttime}'`
    }
    const results = await this.app.mysql.query(sqlstring)
    console.log(results)
    let ret = []
    results.forEach(record => {

      ret.push([
        { name: record.Uname, depart: record.Dept, starttime: record.StartTime }
      ])
    })

    return ret
  }
}

module.exports = QueryService
