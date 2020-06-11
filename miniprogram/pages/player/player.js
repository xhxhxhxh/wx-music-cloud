// miniprogram/pages/player/player.js
let musiclist = []
let musicIndex = ''
const BackgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicInfo: {},
    picUrl: '',
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    musicIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this.loadMusic() 
  },

  // 加载音乐信息
  loadMusic() {
    const musicInfo = musiclist[musicIndex]
    const picUrl = musicInfo.al.picUrl
    console.log( musiclist[musicIndex])
    this.getMusicUrl(musicInfo.id)
    wx.setNavigationBarTitle({
      title: musicInfo.name,
    })
    this.setData({
      musicInfo,
      picUrl
    })
  },

  // 上一首
  prevMusic() {
    musicIndex--
    if(musicIndex < 0) {
      musicIndex = musiclist.length - 1
    }
    this.loadMusic()
  },

  // 下一首
  nextMusic() {
    musicIndex++
    if(musicIndex > musiclist.length - 1) {
      musicIndex = 0
    }
    this.loadMusic()
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

  getMusicUrl(musicId) {
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then((res) => {
      const result = JSON.parse(res.result)
      console.log(result)
      BackgroundAudioManager.src = result.data[0].url
      BackgroundAudioManager.title = this.data.musicInfo.name
      BackgroundAudioManager.coverImgUrl = this.data.picUrl
      BackgroundAudioManager.singer = this.data.musicInfo.ar[0].name
      BackgroundAudioManager.epname = this.data.musicInfo.al.name
      wx.hideLoading()
      this.setData({
        isPlaying: true
      })
    })
  },

  // 播放音乐
  play() {
    const isPlay = this.data.isPlaying
    if(isPlay) {
      BackgroundAudioManager.pause()
    }else {
      BackgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !isPlay
    })
  }
})