// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: Boolean,
    bottom: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    bottomStyle: 0
  },

  observers: {
    'bottom': function(val) {
      if(val) {
        this.setData({
          bottomStyle: val + 'px'
        })
      }else {
        this.setData({
          bottomStyle: 0
        })
      }
    }
  },

  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.triggerEvent('closeModal')
    }
  }
})
