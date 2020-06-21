const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

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
  return app.serve()
}