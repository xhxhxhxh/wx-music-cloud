// miniprogram/pages/blogEdit/blogEdit.js
const maxTextLength = 140
const maxImage = 9
let text = ''
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    selectPhoto: true,
    footerBottom: 0,
    wordsNum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 输入文字时
  onInput(event) {
    text = event.detail.value.trim()
    const textLength = text.length
    if(textLength <= 0) {
      this.setData({
        wordsNum: ''
      })
    }else {
      this.setData({
        wordsNum: `已输入: ${textLength}字`
      })
    }
  },

  // 获取焦点时
  onFocus(event) {
    const height = event.detail.height
    this.setData({
      footerBottom: height
    })
  },

  // 失去焦点时
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },

  // 预览图片
  onPreviewImage(event) {
    const current = event.currentTarget.dataset.imgsrc
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },

  // 删除图片
  onDelImage(event) {
    const index = event.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({
      images,
      selectPhoto: images.length < maxImage ? true : false
    })
  },

  // 添加图片
  onChooseImage() {
    let max = maxImage - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        max = maxImage - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },

  // 发布
  publish() {
    if(!text) {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true,
    })

    const promiseArr = []
    const fileIdArr = []
    const userInfo = wx.getStorageSync('userInfo')

    // 上传图片到云存储
    this.data.images.forEach(item => {
      // 文件扩展名
      let suffix = /\.\w+$/.exec(item)[0]
      const promiseFun = new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item, 
          success: res => {
            fileIdArr.push(res.fileID)
            resolve(res)
          },
          fail: err => {
            reject(err)
          }
        })
      })
      promiseArr.push(promiseFun)
    })

    Promise.all(promiseArr).then(res => {
      // 将数据插入到云数据库
      db.collection('blog').add({
        data: {
          ...userInfo,
          content: text,
          img: fileIdArr,
          createTime: db.serverDate(), // 服务端的时间
        }
      }).then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
        const pages = getCurrentPages()
        pages[pages.length - 2].onPullDownRefresh()
      }).catch(err => {
        console.log(err)
      })
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      })
    })
  }
})