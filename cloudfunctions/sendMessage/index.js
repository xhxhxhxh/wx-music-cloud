// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result = await cloud.openapi.subscribeMessage.send({
    touser: wxContext.OPENID,
    templateId: 'eX1d-2Av1uVanmUg38JtV03OePVH8XVbpk5X3OOzB_0',
    page: '/pages/blogComment/blogComment?blogId=' + event.blogId,
    data: {
      'time1': {
        value: event.date
      },
      'phrase2': {
        value: '评论成功'
      },
      'thing3': {
        value: event.content
      }
    },
    miniprogramState: 'developer'
  })
  return result
}