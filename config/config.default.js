/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    bodyParser: {
      //解除文件大小
      jsonLimit: '50mb',
      formLimit: '50mb'
    }
  })

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1564104215026_549'

  // add your middleware config here
  config.middleware = ['params', 'jwt']

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  // 使用MySQL数据库
  config.mysql = {
    // 单数据库信息配置
    // client: {
    //   host: '192.168.232.131',
    //   port: '3306',
    //   user: 'test',
    //   password: '111111',
    //   database: 'fanyid'
    // },
    client: {
      host: '192.168.40.134',
      port: '3306',
      user: 'fanyid',
      password: '123456',
      database: 'fanyid'
    },
    // client: {
    //   host: '127.0.0.1',
    //   port: '3306',
    //   user: 'root',
    //   password: '',
    //   database: 'fanyid'
    // },
    app: true,
    agent: false
  }

  config.jwt = {
    enable: true,
    ignore: [
      '/user/login',
      '/user/logout',
      '/v1/simil/do',
      '/v1/mt/do',
      '/upload/upimage'
    ] // 哪些请求不需要认证
  }
  // egg-scripts 启动配置项
  // exports.cluster = {
  //   listen: {
  //     port: 7001,
  //     hostname: '127.0.0.1',
  //   }
  // }

  config.security = {
    csrf: {
      enable: false
      // ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:9528/', 'https://translate.google.cn']
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  return {
    ...config,
    ...userConfig
  }
}

exports.session = {
  key: 'FANYID_SESS_2019', //eggjs默认session的key
  maxAge: 24 * 3600 * 1000, // 1 day
  httpOnly: true,
  encrypt: true,
  renew: true //每次访问页面都会给session会话延长时间
}
