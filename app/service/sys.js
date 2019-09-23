'use strict'

const Service = require('egg').Service
const { youdao, baidu, google } = require('translation.js')

class SysService extends Service {
  /**
   * 表查询
   */
  async list(param = {}, tablename) {
    let results = []

    const querydata = {
      where: param
    }
    // console.log(querydata, 'list0')
    results = await this.app.mysql.select(tablename, querydata)
    // console.log(results, 'list1')

    return { data: results, count: results.length }
  }
  /**
   * 表插入记录
   * @param {object}} param
   * @param {String} tablename
   */
  async insert(param = {}, tablename) {
    const result = await this.app.mysql.insert(tablename, param) // 在 tablename 表中，插入 记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1
    const ret = { data: true, msg: '' }
    if (insertSuccess) {
      ret.data = true
      ret.msg = '添加成功'
    } else {
      ret.data = false
      ret.msg = '添加失败'
    }
    // console.log(ret, 'modifyserver0')
    return ret
  }
  /**
   * 更新表
   * @param {Object} param
   * @param {String} tablename
   */
  async update(param = {}, tablename) {
    const ret = { data: true, msg: '' }
    const options = {
      where: { uuid: param.uuid }
    }
    const result = await this.app.mysql.update(tablename, param, options) // 在 tablename 表中，插入 记录

    // 判断更新成功
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      ret.data = true
      ret.msg = '更新成功'
    } else {
      ret.data = false
      ret.msg = '更新失败'
    }
    // console.log(ret, 'modifyserver1')
    return ret
  }
  /**
   *
   */
  async modify(param = {}, tablename) {
    // 新条目
    const ret = { data: true, msg: '' }
    if (param.uuid === 0) {
      const result = await this.app.mysql.insert(tablename, param) // 在 tablename 表中，插入 记录
      console.log(result, 'modify')

      // 判断插入成功
      const insertSuccess = result.affectedRows === 1

      if (insertSuccess) {
        ret.data = true
        ret.msg = '添加成功'
      } else {
        ret.data = false
        ret.msg = '添加失败'
      }
      // console.log(ret, 'modifyserver0')
      return ret
    } else {
      const options = {
        where: { uuid: param.uuid }
      }
      const result = await this.app.mysql.update(tablename, param, options) // 在 tablename 表中，插入 记录

      // 判断更新成功
      const insertSuccess = result.affectedRows === 1
      if (insertSuccess) {
        ret.data = true
        ret.msg = '修改成功'
      } else {
        ret.data = false
        ret.msg = '修改失败'
      }
      // console.log(ret, 'modifyserver1')
      return ret
    }
  }

  /**
   * 判断是否存在
   * @param {Object} param
   * @param {String} tablename
   * @param {Number} uuid
   */
  async valid(param = {}, tablename, uuid = 0) {
    const querydata = {
      where: param
    }
    const results = await this.app.mysql.select(tablename, querydata)

    if (results.length > 0) {
      if (results[0].uuid != uuid) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  /**
   *
   * @param {String} tablename
   * @param {Object} param
   * 返回删除的条目数
   */
  async del(tablename, param) {
    const result = await this.app.mysql.delete(tablename, param)
    console.log(result)
    if (result.affectedRows >= 1) {
      return result.affectedRows
    } else {
      return 0
    }
  }

  async trans(source, from = 'en', to = 'zh-CN', engine = 'google') {
    const { ctx } = this
    console.log(ctx.params)

    const params = { text: source, from: from, to: to, com: false }

    let ret = ''
    switch (engine) {
      case 'google':
        ret = await google.translate(params)
        break
      case 'baidu':
        ret = await baidu.translate(params)
        break
      case 'youdao':
        ret = await youdao.translate(params)
        break
      case 'google(com)':
        params.com = true
        ret = await google.translate(params)
        break
      default:
        ret = await google.translate(params)
        break
    }

    if (typeof ret.result != 'undefined') {
      return {
        code: 20000,
        target: ret.result
      }
    } else {
      // NETWORK_ERROR - 网络错误，可能是运行环境没有网络连接造成的
      // API_SERVER_ERROR - 翻译接口返回了错误的数据
      // UNSUPPORTED_LANG - 接口不支持的语种
      // NETWORK_TIMEOUT - 查询接口时超时了
      return {
        code: 50008,
        target: ret.code
      }
    }
  }
}

module.exports = SysService
