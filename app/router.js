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
  router.get('/user/updateProfile', controller.user.updateProfile)

  // 翻译相关
  // router.get('/v1/trans', controller.trans.test)
  // router.get('/v1/match', controller.trans.match)
  // router.get('/v1/quality', controller.trans.quality)

  router.get('/sys/admin', controller.sys.admin)
  router.post('/sys/modifyadmin', controller.sys.modifyadmin)
  router.post('/sys/deladmin', controller.sys.deladmin)

  router.post('/v1/simil/do', controller.similarity.do)
  router.post('/v1/simil/do2', controller.similarity.do2)
  router.get('/v1/simil/startlog', controller.similarity.startlog)
  router.get('/v1/simil/endlog', controller.similarity.endlog)

  router.post('/v1/mt/do', controller.mt.do)
  router.get('/v1/mt/startlog', controller.mt.startlog)
  router.get('/v1/mt/endlog', controller.mt.endlog)

  router.post('/log/list', controller.syslog.list)
  router.post('/log/detail', controller.syslog.detail)

  router.post('/upload/upimage', controller.upload.upimage)
}
