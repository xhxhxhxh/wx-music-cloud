// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    createTime: ''
  },

  observers: {
    'blog.createTime': function(val) {
      if(val) {
        this.setData({
          createTime: formatTime(new Date(val))
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 预览图片
    onPreviewImage(event) {
      const current = event.currentTarget.dataset.img
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls: this.properties.blog.img // 需要预览的图片http链接列表
      })
    },
  }
})
