'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  // 登录接口
  async login() {
    const { ctx } = this
    const params = ctx.params

    // todo 检测参数是否合理

    //测试
    let tokens = {
      admin: {
        token: 'admin-token',
        name: 'admin'
      },
      editor: {
        token: 'editor-token',
        name: 'edit'
      }
    }
    const res = await ctx.service.user.existed('users', params)

    console.log(params, res, 'login')
    if (res === true) {
      let querydata = {
        where: params,
        limit: 1,
        offset: 0
      }
      const ret = await ctx.service.user.query('users', querydata)
      // console.log(ret, 'ret')
      console.log(ret.results[0], 'ret0')

      tokens[ret.results[0].role].name = ret.results[0].username

      console.log(tokens[ret.results[0].role], 'ret')
      ctx.body = {
        code: 20000,
        // data: tokens[ret.results[0].role],
        data: { token: ret.results[0].username },
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
    console.log(params, 'info0')

    // todo 检测参数是否合理

    //测试
    const users = {
      'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: '/images/admin.png',
        name: 'administrator'
      },
      'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: '/images/guest.png',
        name: 'Normal Editor'
      }
    }

    // const info = users[params.token]
    // ctx.body = {
    //   code: 20000,
    //   data: info
    // }
    const p = { username: params.token }
    const res = await ctx.service.user.existed('users', p)
    console.log(p, res, 'res')

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
      // console.log(params, 'info')
      console.log(info, 'info')

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
