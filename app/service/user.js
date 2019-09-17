'use strict'

const Service = require('egg').Service

class UserService extends Service {
  async status() {
    // const result = await this.app.mysql.query('tb_Dept', { Dept: '部门一' }) // 在 tb_Dept 表中，插入 Dept 为 部门一 的记录
    // // => INSERT INTO `posts`(`title`) VALUES('Hello World');
    // console.log(result)
    // // 判断插入成功
    // const insertSuccess = result.affectedRows === 1
    // if (insertSuccess == true) {
    //   const data = {
    //     ip: '192.168.1.1',
    //     username: '张三',
    //     department: '部门',
    //     status: 1, // 0,没有注册；1，可以开始加班；2，已经开始加班
    //     msg: '请点击加班'
    //   }
    //   return { code: 2000, data: data }
    // }
  }

  async query(tablename, querydata = {}) {
    // const results = await this.app.mysql.select('posts', { // 搜索 post 表
    //     where: { status: 'draft', author: ['author1', 'author2'] }, // WHERE 条件
    //     columns: ['author', 'title'], // 要查询的表字段
    //     orders: [['created_at','desc'], ['id','desc']], // 排序方式
    //     limit: 10, // 返回数据量
    //     offset: 0, // 数据偏移量
    //   });

    //   => SELECT `author`, `title` FROM `posts`
    //     WHERE `status` = 'draft' AND `author` IN('author1','author2')
    //     ORDER BY `created_at` DESC, `id` DESC LIMIT 0, 10;
    const results = await this.app.mysql.select(tablename, querydata)
    return { results }
  }

  // 插入一条记录
  async insert(tablename, insertdata) {
    const result = await this.app.mysql.insert(tablename, insertdata) // 在 tablename 表中，插入 记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1

    return insertSuccess
  }

  // 更新一条记录
  async update(tablename, insertdata, options = {}) {
    // 如果主键是自定义的 ID 名称，如 custom_id，则需要在 `where` 里面配置
    // const row = {
    //     name: 'fengmk2',
    //     otherField: 'other field value',    // any other fields u want to update
    //     modifiedAt: this.app.mysql.literals.now, // `now()` on db server
    //   };

    //   const options = {
    //     where: {
    //       custom_id: 456
    //     }
    //   };
    //=> UPDATE `posts` SET `name` = 'fengmk2', `modifiedAt` = NOW() WHERE custom_id = 456 ;
    const result = await this.app.mysql.update(tablename, insertdata, options) // 在 tablename 表中，插入 记录

    // 判断更新成功
    const insertSuccess = result.affectedRows === 1

    return insertSuccess
  }

  /**
   * 判断记录是否存在
   * @param {String} tablename
   * @param {Object} params
   * 返回 true，表示存在
   * 返回 false,表示不存在
   */
  async existed(tablename = 'users', params = {}) {
    const querydata = {
      where: { username: params.username, password: params.password }
    }
    // console.log(querydata, 'existed')

    const results = await this.app.mysql.select(tablename, querydata)

    if (results.length > 0) {
      return true
    } else {
      return false
    }
  }
  // 登录服务
  async login(msg) {}
}

module.exports = UserService
