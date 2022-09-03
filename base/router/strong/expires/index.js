const Router = require('@koa/router')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

const router = new Router()

const getFilepath = (_path) => {
  return path.resolve(__dirname, _path)
}
const jsFile = 'common.js'
const cssFile = 'common.css'
const imgFile = 'common.jpeg'

const expireTime = new Date('2022-09-04 16:50:00').toUTCString()
const method = 'get'
// const method = 'post'

const commonFunc = (ctx, _path) => {
  const filepath = getFilepath(_path)
  const mimeType = mime.lookup(filepath)
  ctx.set('Content-Type', mimeType)
  ctx.set('Expires', expireTime)
  ctx.body = fs.readFileSync(filepath)
}

// 缺点：依赖浏览器本地时间，时间是可以修改的
router[method]('/strong/expires', (ctx) => {
  commonFunc(ctx, `./index.html`)
})

router[method](`/strong/expires/${jsFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${jsFile}`)
})

router[method](`/strong/expires/${cssFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${cssFile}`)
})

router[method](`/strong/expires/${imgFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${imgFile}`)
})

module.exports = router
