'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.post('/user/login', controller.user.login)
  router.post('/user/logout', controller.user.logout)
  router.get('/user/info', controller.user.info)


  // 翻译相关
  router.get('/v1/trans', controller.trans.test)
  router.get('/v1/match', controller.trans.match)
  router.get('/v1/quality', controller.trans.quality)

  router.get('/sys/admin', controller.sys.admin)
  router.post('/sys/modifyadmin', controller.sys.modifyadmin)
  router.post('/sys/deladmin', controller.sys.deladmin)
}
