// components/authorize/authorize.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo (event) {
      const userInfo = event.detail.userInfo
      if(userInfo) {
        this.triggerEvent('authorizeSuccess', userInfo)
      }else {
        this.triggerEvent('authorizeFail')
      }
    },
    closeModal() {
      this.triggerEvent('closeModal')
    }
  }
})
