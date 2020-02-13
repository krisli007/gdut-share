//index.js
//获取应用实例
const app = getApp()

const db = wx.cloud.database()

Page({
  data: {
    img: ''
  },
  //事件处理函数
  choseImg() {
    let that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          img: tempFilePaths
        })
      }
    })
  },

  // 发帖功能
  formSubmit(e) {
    const product = e.detail.value
    db.collection('product').add({
      data: {
        title: product.title,
        detail: product.detail
      }
    })
    .then(app.updateProduct())
  },


  // 调用删除多条记录的云函数
  deleteAll() {
    wx.cloud.callFunction({
      name: 'delete'
    }).then(console.log)
  },

  onLoad: function () {
  }
})
