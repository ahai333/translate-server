'use strict'

const Service = require('egg').Service

class StatisService extends Service {
  // 获取所有单位统计数据
  async total(daterange) {
    const { ctx } = this

    let dat = []
    const { departs } = await ctx.service.query.getdepts()

    if (departs.length > 0) {
      let sqlstring = `select * from tb_order where StartTime > '${daterange[0].toLocaleString()}' and StartTime < '${daterange[1].toLocaleString()}'`
      const results = await this.app.mysql.query(sqlstring)
      console.log(sqlstring, 'server.total')
      // 总次数
      let counts = new Object()

      //总时间
      let hours = new Object()
      let usercount = new Object()
      let names = []

      departs.forEach(depart => {
        counts[depart] = 0
        hours[depart] = 0
        usercount[depart] = 0
      })
      //  todo: 修改
      for (let i = 0; i < departs.length; i++) {
        names = await ctx.service.query.getnames(departs[i])
        usercount[departs[i]] = names.length
      }

      results.forEach(record => {
        counts[record.Dept]++
        hours[record.Dept] += record.duration
      })

      let avghour = 0
      let avgcount = 0
      departs.forEach(depart => {
        if (counts[depart] == 0) {
          avghour = 0
          avgcount = 0
        } else {
          avghour = hours[depart] / (1000 * 60 * 60 * counts[depart])
          avgcount = counts[depart] / counts[depart]
        }
        dat.push({
          depart: depart,
          usercount: usercount[depart],
          ordercount: counts[depart],
          totalhours: (hours[depart] / (1000 * 60 * 60)).toFixed(2),
          avghours: avghour.toFixed(2),
          avgcount: avgcount.toFixed(2)
        })
      })
    }
    return dat
  }
  async detail(depart, daterange) {
    let names = await this.ctx.service.query.getnames(depart)
    let count = []
    let hours = []
    names.forEach(name => {
      count[name] = 0
      hours[name] = 0
    })
    let sqlstring = `select * from tb_order where StartTime > '${daterange[0].toLocaleString()}' and StartTime < '${daterange[1].toLocaleString()}' and Dept = '${depart}'`
    const results = await this.app.mysql.query(sqlstring)
    results.forEach(record => {
      hours[record.Uname] += record.duration
      count[record.Uname]++
    })
    let ret = []
    names.forEach(name => {
      ret.push({
        name: name,
        count: count[name],
        hours: (hours[name] / (60 * 60 * 1000)).toFixed(2)
      })
    })
    return ret
  }
}

module.exports = StatisService
