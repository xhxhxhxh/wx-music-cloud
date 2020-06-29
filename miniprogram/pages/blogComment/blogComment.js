// miniprogram/pages/blogComment/blogComment.js
import formatTime from '../../utils/formatTime.js'
let blogId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogId: '',
    commentList: [],
    blog: {},
    showModal: false,
    showCommentModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    blogId = options.blogId
    this.setData({
      blogId
    })
    this._getBlogInfo()
  },

  // 分享
  onShareAppMessage(event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: '/pages/blogComment/blogComment?blogId=' + blog._id
    }
  },

  // 获取博客信息
  _getBlogInfo() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId,
        $url: 'detail'
      }
    }).then(res => {
      const commentList = res.result.commentList.data
      commentList.forEach(item => {
        item.createTime = formatTime(new Date(item.createTime))
      })
      this.setData({
        blog: res.result.detail.data[0],
        commentList
      })
      wx.hideLoading()
    })
  },

  // 是否授权
  getAuthorize() {
    wx.getSetting({
      success: (res) => {
        const userInfo = res.authSetting['scope.userInfo']
        if(userInfo) {
          wx.getUserInfo({
            success: (res) => {
              this.onAuthorizeSuccess({detail: res.userInfo})
            }
          })
        }else {
          this.setData({
            showModal: true
          })
        }
      }
    })
  },

  // 授权成功
  onAuthorizeSuccess(event) {
    wx.setStorage({
      data: event.detail,
      key: 'userInfo',
    })
    this.setData({
      showModal: false,
      showCommentModal: true  
    })
  },

  // 授权失败
  onAuthorizeFail() {
    wx.showModal({
      title: '授权用户才能评论',
      content: '',
    })
  },

  showCommentModal() {
    this.getAuthorize()
  },

  // 关闭modal
  closeModal() {
    this.setData({
      showModal: false
    })
  },

  // 关闭评论modal
  closeCommentModal(event) {
    if(event.detail.status) {
      this._getBlogInfo()
    }
    this.setData({
      showCommentModal: false
    })
  },
})