// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onTapQrCode() {
    wx.showLoading({
      title: '生成中',
    })
    wx.cloud.callFunction({
      name: 'getQrCode'
    }).then(res => {
      wx.hideLoading()
      const fileID = res.result.fileID
      wx.previewImage({
        urls: [fileID],
        current: fileID
      })
    })
  }
})