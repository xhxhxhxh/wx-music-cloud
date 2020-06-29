const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('bloglist', async (ctx, next) => {
    const searchWord = event.searchWord
    const w = {}
    if(searchWord.trim()) {
      w.content = new RegExp(searchWord, 'i')
    }
    ctx.body = await cloud.database().collection('blog')
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  app.router('detail', async (ctx) => {
    let blogId = event.blogId
    const detail = await cloud.database().collection('blog')
    .where({
      _id: blogId
    }).get().then((res) => {
      return res
    })

    const countResult = await cloud.database().collection('blog-comment').count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = cloud.database().collection('blog-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      commentList,
      detail,
    }
  })

  return app.serve()
}