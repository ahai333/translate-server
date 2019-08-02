'use strict'

const Service = require('egg').Service

class QueryService extends Service {
  async getdepts() {
    const results = await this.app.mysql.select('tb_dept')
    let departs = []
    results.forEach(record => {
      departs.push(record.Dept)
    })
    return departs
  }
  async getnames(depart = '') {
    const { ctx } = this
    let results = {}
    if (depart == '' || depart == 'undefined') {
      results = await this.app.mysql.select('tb_user')
    } else {
      let querydata = {
        where: { Dept: ctx.params.depart }
      }
      results = await this.app.mysql.select('tb_user', querydata)
    }
    let names = []
    results.forEach(record => {
      names.push(record.Uname)
    })
    return names
  }
}

module.exports = QueryService
