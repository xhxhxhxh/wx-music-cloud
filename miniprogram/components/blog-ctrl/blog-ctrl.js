// components/blog-ctrl/blog-ctrl.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },

  externalClasses: ['iconfont', 'icon-fenxiang', 'icon-pinglun'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      this.triggerEvent('showCommentModal', {blogId: this.properties.blogId})
    }
  }
})
