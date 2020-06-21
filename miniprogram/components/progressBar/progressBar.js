// components/progressBar/progressBar.js
const BackgroundAudioManager = wx.getBackgroundAudioManager()
let movableAreaWidth = 0
let movableViewWidth = 0
let progress = 0
let isMoving = false
let offsetLeft = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    duration: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    totalTime: '00:00',
    currentTime: '00:00',
    x: 0,
    percent: 0,
  },

  observers: {
    'duration': function (number) {
      const totalTime = this.handleTime(parseInt(number))
      this.setData({totalTime})
    }
  },

  lifetimes: {
    ready: function() {
      this.getMovableAreaWidth()
      this.handleMusicTimeUpdate() // 初次进入即调用
      BackgroundAudioManager.onTimeUpdate(this.handleMusicTimeUpdate.bind(this))

      // 播放结束自动下一首
      BackgroundAudioManager.onEnded(() => {
        this.triggerEvent('playEnded')
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理时间
    handleTime(time) {
      let minutes = Math.floor(time / 60)
      let seconds = time % 60
      if(minutes < 10) {
        minutes = '0' + minutes
      }
      if(seconds < 10) {
        seconds = '0' + seconds
      }
      return minutes + ':' + seconds
    },

    handleMusicTimeUpdate() {
      if(isMoving) return
      let _this = this;
      const currentTime = _this.handleTime(parseInt(BackgroundAudioManager.currentTime))
      if(currentTime.split(':')[1] !== this.data.currentTime.split(':')[1]){
        progress = (BackgroundAudioManager.currentTime / this.properties.duration)* 100
        this.triggerEvent('setCurrentTime', {currentTime: BackgroundAudioManager.currentTime})
        this.setData({
          currentTime,
          x: movableAreaWidth * progress / 100,
          percent: progress
        })
      }
    },

    // 获取滑动区域宽度
    getMovableAreaWidth() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        offsetLeft = rect[0].left
        movableAreaWidth = rect[0].width - rect[1].width
        movableViewWidth = rect[1].width
      })
    },

    // 拖到滑块事件
    movableViewChange(e) {
      const type = e.detail.source
      if(type === 'touch') {
        isMoving = true
        progress = e.detail.x / movableAreaWidth * 100
      }
    },

    // 滑块拖动结束
    moveEnd() {
      BackgroundAudioManager.seek(progress * this.properties.duration / 100)
      this.setData({
        x: movableAreaWidth * progress / 100,
        percent: progress
      }, () => {isMoving = false})
    },

    // 点击进度条
    tapMovableArea(e) {
      const opsitionX = e.detail.x - offsetLeft
      let x = opsitionX - movableViewWidth / 2
      if(x < 0) {
        x = 0
      }
      if(x > movableAreaWidth) {
        x = movableAreaWidth
      }
      progress = x / movableAreaWidth * 100
      isMoving = true
      this.moveEnd()
    }
  }
})
