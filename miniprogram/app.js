//app.js
App({
  // 云开发初始化
  cloudInit() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'krislishare-cloud',
        traceUser: true,
      })
    }
  },

  // 页面初始化更新商品数据
  async updateProduct() {
    const db = wx.cloud.database()
    await db.collection('product').get().then(res => {
      this.globalData.product = res.data.reverse()
      console.log(this.globalData.product)
    })
  },

  // 页面初始化
  onLaunch: function () {
    this.globalData = {
      product: null
    }

    this.cloudInit()

    this.updateProduct()
  }
})
