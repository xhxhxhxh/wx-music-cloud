// pages/blog/blog.js
const MAX_LIMIT = 3
let searchWord = ''
let modalType = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showCommentModal: false,
    bloglist: [],
    currentBlogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBlogList()
  },

  onPullDownRefresh: function () {
    this.setData({ bloglist: [] })
    this._getBlogList()
  },

  // 分享
  onShareAppMessage(event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: '/pages/blogComment/blogComment?blogId=' + blog._id
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getBlogList()
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
    if(modalType === 'comment') {
      this.setData({
        showModal: false,
        showCommentModal: true  
      })
      modalType = ''
    }else {
      this.setData({
        showModal: false  
      })
      modalType = ''
      wx.navigateTo({
        url: '/pages/blogEdit/blogEdit',
      })
    }
  },

  // 授权失败
  onAuthorizeFail() {
    wx.showModal({
      title: modalType === 'comment' ? '授权用户才能评论' : '授权用户才能发布',
      content: '',
    })
  },

  // 加载博客列表
  _getBlogList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        searchWord,
        start: this.data.bloglist.length,
        count: MAX_LIMIT,
        $url: 'bloglist',
      }
    }).then((res) => {
      const data = res.result.data
      this.setData({
        bloglist: this.data.bloglist.concat(data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },

  // 搜索
  onSearch(event) {
    searchWord = event.detail.value
    this.setData({ bloglist: [] })
    this._getBlogList()
  },

  // 显示评论modal
  showCommentModal(event) {
    modalType = 'comment'
    this.setData({
      currentBlogId: event.detail.blogId
    })
    this.getAuthorize()
  },

  // 关闭modal
  closeModal() {
    modalType = ''
    this.setData({
      showModal: false
    })
  },

  // 关闭评论modal
  closeCommentModal() {
    this.setData({
      showCommentModal: false
    })
  },

  // 跳转评论页
  goBlogComment(event) {
    const blogId = event.currentTarget.dataset.blogid
    wx.navigateTo({
      url: '/pages/blogComment/blogComment?blogId=' + blogId,
    })
  }
})