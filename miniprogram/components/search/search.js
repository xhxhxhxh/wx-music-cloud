// components/search/search.js
let value = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  externalClasses: ['iconfont', 'icon-sousuo'],

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      value = event.detail.value
    },
    onSearch() {
      this.triggerEvent('search', {value})
    }
  }
})
