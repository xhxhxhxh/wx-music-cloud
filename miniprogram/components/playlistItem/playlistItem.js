// components/playlistItem/playlistItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object
  },

  observers: {
    'data.playCount': function (number) {
      const newNumber = this._transNum(number, 2)
      this.setData({
        count: newNumber
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 数字转换
    _transNum(data, digits) {
      const length = data.toString().length
      if (length >= 6 && length <= 8) {
        return (data / 10000).toFixed(digits) + '万'
      }else if (length > 8) {
        return (data / 100000000).toFixed(digits) + '亿'
      }
      return data
    },

    gotoMusiclist() {
      const data = this.properties.data
      wx.navigateTo({
        url: '../../pages/musiclist/musiclist?playlistId=' + data.id,
      })
    }
  }
})
