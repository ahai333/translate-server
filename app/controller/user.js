'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  // 获取ip对应的用户名
  async status() {
    // 获取客户端ip
    const { ctx } = this
    const ip = ctx.ip

    let tablename = 'tb_user'
    let querydata = {
      where: { IpAddr: ctx.ip }
    }
    const result = await ctx.service.user.query(tablename, querydata)

    let stat = 0
    let msg = ''

    if (result.results.length == 1) {
      let { Uname, Dept } = result.results[0]
      tablename = 'tb_order'
      querydata = {
        where: { Uname: Uname },
        orders: [['StartTime', 'desc']],
        limit: 1,
        offset: 0
      }

      const r = await ctx.service.user.query(tablename, querydata)
      if (r.results.length == 1) {
        // console.log(r.results, 'results')
        // console.log(typeof(r.results[0].StartTime), 'time')
        if (r.results[0].EndTime - r.results[0].StartTime == 0) {
          stat = 2
          msg = '加班开始时间：' + r.results[0].StartTime.toLocaleString()
        } else {
          stat = 1
          msg = '请点击加班'
        }
      } else {
        stat = 1
        msg = '请点击加班'
      }
      ctx.body = {
        code: 20000,
        data: {
          ip: ctx.ip,
          username: Uname,
          department: Dept,
          status: stat,
          msg: msg
        }
      }
    } else {
      msg = '该ip没有注册，请联系管理员添加！'
      stat = 0
      ctx.body = {
        code: 20000,
        data: {
          ip: ctx.ip,
          username: '',
          department: '',
          status: stat,
          msg: msg
        }
      }
    }
    console.log(ctx.body, 'status')
  }

  // 点击“开始加班”
  async start() {
    const { ctx } = this
    const tablename = 'tb_order'
    const time = new Date()
    const { Uname, IpAddr, Dept } = ctx.query
    console.log(ctx.query, 'ctx.query')

    //todo:判断格式

    const querydata = {
      Uname: Uname,
      IpAddr: IpAddr,
      Dept: Dept,
      StartTime: time,
      EndTime: time
    }
    const r = await ctx.service.user.insert(tablename, querydata)
    let ret = {}
    // 判断插入成功
    if (r) {
      ret = {
        code: 20000,
        data: {
          ip: IpAddr,
          username: Uname,
          department: Dept,
          status: 2, // 0,没有注册；1，可以开始加班；2，已经开始加班
          msg: '加班开始时间：' + time.toLocaleString()
        }
      }
    } else {
      ret = {
        code: 50000,
        data: {
          msg: '数据库写入错误'
        }
      }
    }

    ctx.body = ret
  }
  // 点击“回去休息”
  async end() {
    const { ctx } = this
    const tablename = 'tb_order'
    const time = new Date()

    let stat = 2
    let msg = '错误！'
    let code = 50000

    const { Uname, IpAddr, Dept } = ctx.query
    let querydata = {
      where: { Uname: Uname },
      orders: [['StartTime', 'desc']],
      limit: 1,
      offset: 0
    }

    const r = await ctx.service.user.query(tablename, querydata)
    console.log(r, 'query')
    if (r.results.length == 1) {
      if (r.results[0].EndTime - r.results[0].StartTime == 0) {
        const total = new Date() - r.results[0].StartTime
        const t = new Date(0, 0, 1, 0, 0, 0, total)
        querydata = {
          EndTime: new Date(),
          TotalTime: t, // 兼容上个版本
          duration: total
        }
        const options = {
          where: {
            RdNum: r.results[0].RdNum
          }
        }
        console.log(querydata, 'end')
        const rt = await ctx.service.user.update(tablename, querydata, options)
        if (rt) {
          code = 20000
          stat = 1
          msg = '本次加班时长：' + ctx.helper.getduration(total)
        }
      }
    }

    //todo:判断格式

    ctx.body = {
      code: code,
      data: {
        ip: IpAddr,
        username: Uname,
        department: Dept,
        status: stat,
        msg: msg
      }
    }
  }
  // 登录接口
  async login() {
    const { ctx } = this
    const params = ctx.params
    console.log(params, 'login')

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

    ctx.body = {
      code: 20000,
      data: tokens['admin']
    }
  }

  async info() {
    const { ctx } = this
    console.log(ctx, 'info0')
    const params = ctx.params

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
    console.log(params, 'info')
    console.log(info, 'info')

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
