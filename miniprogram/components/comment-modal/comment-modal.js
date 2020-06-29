// components/comment-modal/comment-modal.js
const formatTime = require('../../utils/formatTime.js')
const db = wx.cloud.database()
let tabBarHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showCommentModal: Boolean,
    blogId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: '',
    footerBottom: 0
  },

  lifetimes: {
    ready() {
      this.getSystemInfo()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取系统信息
    getSystemInfo() {
      wx.getSystemInfo({
        success(res) {
          tabBarHeight = res.screenHeight - res.safeArea.height
        },
      })
    },

    closeCommentModal(event, success) {
      this.triggerEvent('closeCommentModal', {status: success})
    },

    onInput(event) {
      this.setData({
        text: event.detail.value.trim()
      })
    },

    // 获取焦点时
    onFocus(event) {
      const height = event.detail.height
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const currentRoute = currentPage.route
      const route = 'pages/blog/blog'
      this.setData({
        footerBottom: currentRoute === route ? height > 0 ? height - tabBarHeight : 0 : height
      })
    },

    onBlur() {
      this.setData({
        footerBottom: 0
      })
    },

    send() {
      const text = this.data.text
      if(text) {
        wx.showLoading({
          title: '评论中',
          mask: true,
        })
        this.requestSubscribeMessage(text)
        const userInfo = wx.getStorageSync('userInfo')
        db.collection('blog-comment').add({
          data: {
            content: text,
            createTime: db.serverDate(),
            blogId: this.properties.blogId,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          }
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '评论成功',
          })
          this.setData({
            text: ''
          })
          this.closeCommentModal(null, true)
        })
      }
    },

    // 订阅消息
    requestSubscribeMessage(content) {
      console.log(formatTime(new Date()))
      wx.requestSubscribeMessage({
        tmplIds: ['eX1d-2Av1uVanmUg38JtV03OePVH8XVbpk5X3OOzB_0'],
        success: () => {
          wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              content,
              date: formatTime(new Date()),
              blogId: this.properties.blogId
            }
          }).then((res) => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
})
