// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentId: ''
  },

  pageLifetimes: {
    show: function() {
      const id = app.getPlayingMusicId()
      this.setData({
        currentId: id
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setActiveMusic(event) {
      const id = event.currentTarget.dataset.id
      const index = event.currentTarget.dataset.index
      this.setData({
        currentId: id
      })
      wx.navigateTo({
        url: `/pages/player/player?musicId=${id}&index=${index}`,
      })
    }
  }
})
