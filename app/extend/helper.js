'use strict'
const Crypto = require('crypto')

module.exports = {
  encrypt(data) {
    // sha1加密
    const hmac = Crypto.createHmac('sha1', this.config.pwd_salt)
    hmac.update(data)
    const result = hmac.digest('hex')
    return result
  },
  localDate(v) {
    const d = new Date(v || Date.now())
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString()
  },
  rndNum(n) {
    let rnd = ''
    for (let i = 0; i < n; i++) {
      rnd += Math.floor(Math.random() * 10)
    }
    return rnd
  },
  // 获取时间差
  getduration(value) {
    let secondTime = parseInt(value / 1000) // 秒
    let minuteTime = 0 // 分
    let hourTime = 0 // 小时
    let DayTime = 0 //天
    if (secondTime > 60) {
      //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)

        if(hourTime > 24){
            DayTime = parseInt(hourTime / 24)

            hourTime = parseInt(minuteTime % 24)
        }
      }
    }
    var result = '' + parseInt(secondTime) + '秒'

    if (minuteTime > 0) {
      result = '' + parseInt(minuteTime) + '分' + result
    }
    if (hourTime > 0) {
      result = '' + parseInt(hourTime) + '小时' + result
    }
    if (DayTime > 0) {
        result = '' + parseInt(DayTime) + '天' + result
      }
    return result
  }
}
