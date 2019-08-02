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
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1564104215026_549'

  // add your middleware config here
  config.middleware = ['params']

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  // 使用MySQL数据库
  config.mysql = {
    // 单数据库信息配置
    client: {
      host: '192.168.232.131',
      port: '3306',
      user: 'test',
      password: '111111',
      database: 'order'
    },
    app: true,
    agent: false
  }

  config.security = {
    csrf: {
     enable: false,
    // ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:9528/', 'http://192.168.232.131']
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
