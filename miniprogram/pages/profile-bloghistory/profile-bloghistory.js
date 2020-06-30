// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LIMIT = 5
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


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ bloglist: [] })
    this._getBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getBlogList()
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: '/pages/blogComment/blogComment?blogId=' + blog._id
    }
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

  // 加载博客列表
  _getBlogList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start: this.data.bloglist.length,
        count: MAX_LIMIT,
        $url: 'bloglistByOpenid',
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

  // 显示评论modal
  showCommentModal(event) {
    this.setData({
      currentBlogId: event.detail.blogId
    })
    this.getAuthorize()
  },

  // 关闭modal
  closeModal() {
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