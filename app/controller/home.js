'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg:' + ctx.ip + '\n' + ctx.host;
  }
}

module.exports = HomeController;
