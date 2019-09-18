'use strict'

const Service = require('egg').Service

class SysService extends Service {
  /**
   * 查询
   */
  async list(param = {}, tablename) {
    let results = []

    const querydata = {
      where: param
    }
    results = await this.app.mysql.select(tablename, querydata)
    console.log(results, 'results')

    return { data: results, count: results.length }
  }

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
   *
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
}

module.exports = SysService
