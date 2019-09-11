'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  // 登录接口
  async login() {
    const { ctx } = this
    const params = ctx.params

    // todo 检测参数是否合理

    //测试
    const tokens = {
      admin: {
        token: 'admin-token'
      },
      editor: {
        token: 'editor-token'
      }
    }

    if (params.username == 'admin') {
      if (params.password == '!QAZ2wsx') {
        ctx.body = {
          code: 20000,
          data: tokens['admin']
        }
      } else {
        ctx.body = { code: 60204, message: '登录密码错误' }
      }
    } else {
      ctx.body = {
        code: 20000,
        data: tokens['editor']
      }
    }
    console.log(ctx.body, 'login')
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
        avatar:
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: '管理员'
      },
      'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar:
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
      }
    }

    const info = users[params.token]
    // console.log(params, 'info')
    // console.log(info, 'info')

    ctx.body = {
      code: 20000,
      data: info
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
