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

const method = 'get'
// const method = 'post'

const commonFunc = (ctx, _path) => {
  const ifModifiedSince = ctx.header['if-modified-since']
  const filepath = getFilepath(_path)
  const mimeType = mime.lookup(filepath)

  const fileStatus = fs.statSync(filepath)
  const fileUTime = fileStatus.mtime.toUTCString()

  ctx.set('Content-Type', mimeType)
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Last-Modified', fileUTime)
  // console.log('--文件状态--', fileStatus)
  // 非第一次请求
  if (ifModifiedSince) {
    // 判断请求头内的时间和文件的最后修改时间是否一致
    // 时间一样说明文件未修改
    if (ifModifiedSince === fileUTime) {
      ctx.status = 304
    } else {
      ctx.body = fs.readFileSync(filepath)
    }
  } else {
    ctx.body = fs.readFileSync(filepath)
  }
}

router[method]('/weak/time', (ctx) => {
  commonFunc(ctx, `./index.html`)
})

router[method](`/weak/time/${jsFile}`, async (ctx) => {
  commonFunc(ctx, `../../../asset/${jsFile}`)
})

router[method](`/weak/time/${cssFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${cssFile}`)
})

router[method](`/weak/time/${imgFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${imgFile}`)
})

module.exports = router
