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

// 单位是秒
const expireTime = 'max-age=120'
const method = 'get'
// const method = 'post'

const commonFunc = (ctx, _path) => {
  const filepath = getFilepath(_path)
  const mimeType = mime.lookup(filepath)
  ctx.set('Content-Type', mimeType)
  ctx.set('Cache-Control', expireTime)
  ctx.body = fs.readFileSync(filepath)
}

router[method]('/strong/cache', (ctx) => {
  // const filepath = getFilepath(`./index.html`)
  // const mimeType = mime.lookup(filepath)
  // ctx.set('Content-Type', mimeType)
  // ctx.set('Cache-Control', expireTime)
  // ctx.body = fs.readFileSync(filepath)
  commonFunc(ctx, `./index.html`)
})

router[method](`/strong/cache/${jsFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${jsFile}`)
})

router[method](`/strong/cache/${cssFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${cssFile}`)
})

router[method](`/strong/cache/${imgFile}`, (ctx) => {
  commonFunc(ctx, `../../../asset/${imgFile}`)
})

module.exports = router

// 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容。（例如：1.该响应没有max-age指令或Expires消息头；2. 该响应对应的请求方法是 POST 。）
// ctx.set('Cache-Control', 'public')

// 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容，比如：对应用户的本地浏览器。
// ctx.set('Cache-Control', 'private')

// 在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证 (协商缓存验证)。
// ctx.set('Cache-Control', 'no-cache')

// 缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。
// ctx.set('Cache-Control', 'no-store')

// 设置缓存存储的最大周期，超过这个时间缓存被认为过期 (单位秒)。与Expires相反，时间是相对于请求的时间。
// 从第一次请求资源的时候开始，往后N秒内，资源若再次请求，则直接从磁盘（或内存中读取），不与服务器做任何交互。
// 中因为max-age后面的值是一个滑动时间，从服务器第一次返回该资源时开始倒计时。所以也就不需要比对客户端和服务端的时间，解决了Expires所存在的巨大漏洞。
// ctx.set('Cache-Control', 'max-age=120')

// 覆盖max-age或者Expires头，但是仅适用于共享缓存 (比如各个代理)，私有缓存会忽略它。
// ctx.set('Cache-Control', 's-maxage=1000')

// 表明客户端愿意接收一个已经过期的资源。可以设置一个可选的秒数，表示响应不能已经过时超过该给定的时间。
// ctx.set('Cache-Control', 'max-stale')

// 表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应。
// ctx.set('Cache-Control', ' min-fresh=2000')

// Experimental表明客户端愿意接受陈旧的响应，同时在后台异步检查新的响应。秒值指示客户愿意接受陈旧响应的时间长度。
// ctx.set('Cache-Control', 'stale-while-revalidate=3000')

// 一旦资源过期（比如已经超过max-age），在成功向原始服务器验证之前，缓存不能用该资源响应后续请求。
// ctx.set('Cache-Control', 'must-revalidate')

// 与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。
// ctx.set('Cache-Control', 'proxy-revalidate')
