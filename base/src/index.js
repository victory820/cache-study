const Koa = require('koa')
const Router = require('@koa/router')

const strongExpires = require('../router/strong/expires')
const strongCache = require('../router/strong/cacheControl')

const weakTime = require('../router/weak/time')
const weakContent = require('../router/weak/content')

const app = new Koa()
const router = new Router()

const port = 9999

router.get('/', (ctx) => {
  ctx.body = 'this is root router'
})

app
  .use(strongExpires.routes())
  .use(strongCache.routes())
  .use(weakTime.routes())
  .use(weakContent.routes())
  .use(router.routes())
  // 自动丰富 response 相应头，当未设置响应状态(status)的时候自动设置，在所有路由中间件最后设置(全局，推荐)，也可以设置具体某一个路由（局部），例如：router.get('/index', router.allowedMethods()); 这相当于当访问 /index 时才设置
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log('service is running on port: ' + port)
})
