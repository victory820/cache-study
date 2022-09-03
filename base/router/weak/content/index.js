const Router = require('@koa/router')
const fs = require('fs')
const path = require('path')
const { createHash } = require('node:crypto')

const mime = require('mime-types')

const router = new Router()

const getFilepath = (_path) => {
  return path.resolve(__dirname, _path)
}
const jsFile = 'common.js'
const cssFile = 'common.css'
const imgFile = 'common.jpeg'

const method = 'get'
// const method = 'post'

const commonFunc = (ctx, _path) => {
  const ifNoneMatch = ctx.header['if-none-match']
  const filepath = getFilepath(_path)
  const mimeType = mime.lookup(filepath)

  const hash = createHash('sha224')
  const fileContent = fs.readFileSync(filepath)
  hash.update(fileContent)
  const etag = hash.digest('hex')

  ctx.set('Content-Type', mimeType)
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('ETag', etag)
  // 非第一次请求
  if (ifNoneMatch) {
    // 判断请求头内的etag和服务器生成的etag是否一致
    // 一致说明文件未修改
    if (ifNoneMatch === etag) {
      ctx.status = 304
    } else {
      ctx.body = fs.readFileSync(filepath)
    }
  } else {
    ctx.body = fs.readFileSync(filepath)
  }
}

router[method]('/weak/content', (ctx) => {
  commonFunc(ctx, `./index.html`)
})

router[method](`/weak/content/${jsFile}`, async (ctx) => {
  commonFunc(ctx, `../../../asset/${jsFile}`)
})

router[method](`/weak/content/${cssFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${cssFile}`)
})

router[method](`/weak/content/${imgFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${imgFile}`)
})

module.exports = router
