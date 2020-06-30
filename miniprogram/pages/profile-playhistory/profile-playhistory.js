// pages/profile-playhistory/profile-playhistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusiclist()
  },

  // 获取播放列表
  getMusiclist() {
    const openid = app.globalData.openid
    const musiclist = wx.getStorageSync(openid)
    if(musiclist.length === 0) {
      wx.showToast({
        title: '暂无播放历史',
        icon: 'none'
      })
    }else {
      this.setData({
        musiclist
      })
      wx.setStorage({
        data: musiclist,
        key: 'musiclist',
      })
    }
  }
})