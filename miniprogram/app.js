//app.js
App({
  onLaunch: function () {
    this.checkUpate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-i8v9x',
        traceUser: true,
      })
    }

    this.globalData = {
      playingMusicId: '',
      lyric: '',
      openid: ''
    }

    this.getOpenid()
  },

  setPlayingMusicId(id) {
    this.globalData.playingMusicId = id
  },

  getPlayingMusicId() {
    return this.globalData.playingMusicId
  },

  setLyric(lyric) {
    this.globalData.lyric = lyric
  },

  getLyric() {
    return this.globalData.lyric
  },

  // 获取openid
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid
      this.globalData.openid = openid
      if(!wx.getStorageSync(openid)) {
        wx.setStorage({
          data: [],
          key: openid,
        })
      }
    })
  },

  checkUpate(){
    const updateManager = wx.getUpdateManager()
    // 检测版本更新
    updateManager.onCheckForUpdate((res)=>{
      if (res.hasUpdate){
        updateManager.onUpdateReady(()=>{
          wx.showModal({
            title: '更新提示',
            content: '发现新版本，是否立即更新',
            success(res){
              if(res.confirm){
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  },

  onShow: function () {
    
  },

})
