// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result = await cloud.openapi.wxacode.get({
    path: 'pages/playlist/playlist?id=' + wxContext.OPENID
  })
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() * 1000000 + '.png',
    fileContent: result.buffer, 
  })
  return upload
}