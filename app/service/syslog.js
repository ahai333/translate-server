'use strict'

const Service = require('egg').Service

class SyslogService extends Service {
  /**
   * //写日志
   * @param {string} tablename
   * @param {Object} param
   */
  async writeLogs(tablename, param) {}
}

module.exports = SyslogService
