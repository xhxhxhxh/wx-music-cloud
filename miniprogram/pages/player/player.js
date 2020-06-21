// miniprogram/pages/player/player.js
let musiclist = []
let musicIndex = ''
const BackgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicInfo: {},
    picUrl: '',
    isPlaying: false,
    duration: 0,
    isLyric: false,
    lyric: '',
    currentTime: 0,
    musicId: ''
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
    wx.setNavigationBarTitle({
      title: musicInfo.name,
    })
    this.setData({
      musicInfo,
      picUrl,
      musicId: musicInfo.id,
      isPlaying: !BackgroundAudioManager.paused
    })
    if(app.getPlayingMusicId() === musicInfo.id) {
      this.setData({
        duration: BackgroundAudioManager.duration,
        lyric: app.getLyric()
      })
      return
    }
    BackgroundAudioManager.stop()
    this.getMusicUrl(musicInfo.id)
    this.getLyric(musicInfo.id)
    app.setPlayingMusicId(musicInfo.id)
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
      if (result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
          icon: 'none'
        })
        return
      }
      BackgroundAudioManager.onPlay(() => {
        this.setData({
          duration: BackgroundAudioManager.duration,
          isPlaying: true
        })
      })
      BackgroundAudioManager.onPause(() => {
        this.setData({
          isPlaying: false
        })
      })
      BackgroundAudioManager.src = result.data[0].url
      BackgroundAudioManager.title = this.data.musicInfo.name
      BackgroundAudioManager.coverImgUrl = this.data.picUrl
      BackgroundAudioManager.singer = this.data.musicInfo.ar[0].name
      BackgroundAudioManager.epname = this.data.musicInfo.al.name
      
      wx.hideLoading()
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
  },

  // 切换歌词
  switchToLyric() {
    this.setData({
      isLyric: !this.data.isLyric
    })
  },

  // 获取歌词
  getLyric(musicId) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'lyric',
      }
    }).then(res => {
      const lrc = JSON.parse(res.result).lrc
      const lyric = lrc ? lrc.lyric : '暂无歌词'
      app.setLyric(lyric)
      this.setData({
        lyric
      })
    })
  },

  setCurrentTime(e) {
    this.setData({
      currentTime: parseInt(e.detail.currentTime)
    })
  }
})