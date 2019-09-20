'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  // 登录接口
  async login() {
    const { ctx } = this
    const params = ctx.params

    const res = await ctx.service.user.existed('users', params)

    // console.log(params, res, 'login')
    if (res === true) {
      let querydata = {
        where: params,
        limit: 1,
        offset: 0
      }
      const ret = await ctx.service.user.query('users', querydata)
      // console.log(ret, 'ret')
      // console.log(ret.results[0], 'ret0')

      const token = ctx.helper.loginToken(
        { username: ret.results[0].username, userid: ret.results[0].uuid },
        7200
      ) // token生成，保存username和userid信息
      // ctx.session[ret.results[0].username + ret.results[0].uuid] = token // 保存token用于后续与客户端校验

      ctx.body = {
        code: 20000,
        data: { token: ret.results[0].username, auth: token },
        msg: '登录成功'
      }
    } else {
      ctx.body = { code: 60204, message: '登录密码错误' }
    }

    // console.log(ctx.body, 'login')
  }

  async info() {
    const { ctx } = this
    const params = ctx.params

    // todo 检测参数是否合理

    const p = { username: params.token }
    const res = await ctx.service.user.existed('users', p)
    // console.log(p, res, 'res')

    if (res === true) {
      let querydata = {
        where: { username: params.token },
        limit: 1,
        offset: 0
      }
      const ret = await ctx.service.user.query('users', querydata)
      let info = {
        roles: [ret.results[0].role],
        introduction: ret.results[0].remarks,
        avatar: '/images/guest2.jpg',
        name: ret.results[0].name
      }

      ctx.body = {
        code: 20000,
        data: info
      }
    } else {
      ctx.body = {
        code: 50000,
        data: 'error!'
      }
    }
  }

  // 注销
  async logout() {
    this.ctx.body = {
      code: 20000,
      data: 'success'
    }
  }
}

module.exports = UserController
