// components/lyric/lyric.js
let lyricRect = []
let currentMusicId = ''
let lyricHeight = 0
let scrolling = false
let timeout = null
let fingerScroll = false
let firstCurrentTime = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: Boolean,
    lyric: String,
    currentTime: Number,
    musicId: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    lyricList: [],
    lyricObj: {},
    nowLyricIndex: 0,
    scrollTop: 0
  },

  observers: {
    'lyric': function(lyric) {
      if(lyric === '暂无歌词') {
        this.setData({
          lyricList: ['暂无歌词'],
          lyricObj: {0: 0}
        })
      }else {
        this._parseLyric(lyric)
      }
    },
    'currentTime': function(currentTime) {
      firstCurrentTime = currentTime
      if(this.data.lyricList.length <= 0) return
      const index = this.getLyricIndex(Math.round(currentTime))
      if(index !== undefined) {
        if(fingerScroll || scrolling) {
          this.setData({
            nowLyricIndex: index
          })
        }else {
          this.setData({
            nowLyricIndex: index,
            scrollTop: index * lyricHeight
          })
        }       
      }
    },
    'isLyricShow': function() {
      const scrollTop = this.data.scrollTop
      if(scrollTop > 0) {
        this.setData({
          scrollTop: scrollTop
        })
      }
    },
    'musicId': function(musicId) {
      if(musicId !== currentMusicId && this.data.lyricList.length > 0) {
        currentMusicId = musicId
        this.setData({
          lyricList: [],
          lyricObj: {}
        })
      }
    }
  },

  lifetimes: {
    ready() {
      // 750rpx
      wx.getSystemInfo({
        success(res) {
          // console.log(res)
          // 求出1rpx的大小
          lyricHeight = res.screenWidth / 750 * 72
        },
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理歌词
    _parseLyric(lyric) {
      const lyricArr = lyric.split('\n')
      const lyricList = []
      const lyricObj = {}
      let index = 0
      lyricArr.forEach(item => {
        const pattern = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
        let time = pattern.exec(item)
        if(time) {
          let lrc = item.split(time[0])[1]
          let seconds = parseInt(time[1]) * 60 + parseInt(time[2])
          lyricList.push(lrc)
          lyricObj[seconds] = index
          index++
        }
      })
      this.setData({
        lyricList,
        lyricObj
      })
    },

    // 获取歌词位置次序
    getLyricIndex(currentTime) {
      const index = this.data.lyricObj[currentTime]
      if(currentTime > 0 && index === undefined) {
        return this.getLyricIndex(currentTime - 1)
      }
      return index ? index : 0
    },

    // 滚动歌词时
    scrolling() {
      if(!fingerScroll) return
      scrolling = true
      if(timeout){
        clearInterval(timeout)
      }
      timeout = setTimeout(() => {
        timeout = null
        scrolling = false
      }, 3000)
    },

    // 开始滚动
    startScroll() {
      fingerScroll = true
    },

    // 结束滚动
    endScroll() {
      fingerScroll = false
    }
  }
})
