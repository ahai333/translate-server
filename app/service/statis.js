'use strict'

const Service = require('egg').Service

class StatisService extends Service {
  // 获取所有单位统计数据
  async total(daterange) {
    const { ctx } = this
    let sqlstring = `select * from tb_order where StartTime > '${
      daterange[0]
    }' and StartTime < '${daterange[1]}'`
    const results = await this.app.mysql.query(sqlstring)

    const departs = await ctx.service.query.getdepts()

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
    let dat = []

    let avg = 0
    departs.forEach(depart => {
      if (counts[depart] == 0) {
        avg = 0
      } else {
        avg = hours[depart] / (1000 * 60 * 60 * counts[depart])
      }
      dat.push({
        depart: depart,
        usercount: usercount[depart],
        ordercount: counts[depart],
        totalhours: hours[depart] / (1000 * 60 * 60),
        avgcount: avg
      })
    })

    return dat
  }
}

module.exports = StatisService
