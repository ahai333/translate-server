'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/user/status', controller.user.status)
  router.get('/user/start', controller.user.start)
  router.get('/user/end', controller.user.end)
  router.post('/user/login', controller.user.login)
  router.get('/user/info', controller.user.info)
  router.post('/table/records', controller.table.records)
  router.get('/table/getdepts', controller.table.getdepts)
  router.get('/table/getnames', controller.table.getnames)
}
