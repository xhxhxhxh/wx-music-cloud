// miniprogram/pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    musicInfo: {},
    playlistId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getMusicList(options.playlistId)
    this.setData({
      playlistId: options.playlistId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取音乐列表信息
  _getMusicList(playlistId) {
    wx.showLoading({
      title: '列表加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId,
        $url: 'musiclist',
      }
    }).then((res) => {
      console.log(res)
      const playlist = res.result.playlist
      this.setData({
        musiclist: playlist.tracks,
        musicInfo: {
          name: playlist.name,
          imgUrl: playlist.coverImgUrl
        }
      })
      wx.hideLoading()
      wx.setStorageSync('musiclist', playlist.tracks)
    })
  }
})