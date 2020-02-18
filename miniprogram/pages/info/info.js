// pages/info/info.js
const db = wx.cloud.database()
const _ = db.command

const app = getApp()

Page({

  data: {
    loginStatus: 0,
    sendProduct: null,
    saleProduct:null,
    buyProduct: null,
    starProduct: null,
  },

  // 第一次登录获得用户授权信息
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.loginStatus = 1,
    this.setData({
      loginStatus: 1
    })
    this.initPageInfo()
  },

  // 我发布的
  getSendProduct() {
    const that = this
    wx.cloud.callFunction({
      name: 'getProductInfo',
      data: { method: 'getUserSend' }
    }).then(res => {
        that.setData({ sendProduct: res.result.data })
    })
  }, 
  // 我卖出的 
  getSaleProduct() {
    const that = this
    wx.cloud.callFunction({
      name: 'getProductInfo',
      data: { method: 'getUserSale' }
    }).then(res => {
        that.setData({ sendProduct: res.result.data })
    })
  }, 
  // 我买到的
  getBuyProduct() {

  },
  // 我收藏的
  getStarProduct() {
    const that = this
    wx.cloud.callFunction({
      name: 'getProductInfo',
      data: { method: 'getUserStar' }
    }).then(res => {
        that.setData({ starProduct: res.result.data })
    })
  }, 
  // 我干的一切的商品列表
  async toUserProdListUrl(e) {
    await app.checkLoginStatus()
    let index = e.currentTarget.dataset.index
    let prodType = null
    let that = this.data
    
    switch (index) {
      case '0':
        prodType = that.sendProduct
        break;
      case '1':
        prodType = that.saleProduct
        break;
      case '2':
        prodType = that.buyProduct
        break;
      case '3':
        prodType = that.starProduct
        break;
    }
    wx.navigateTo({
      url: `../prodlist/prodlist?index=${index}&prodlist=` + JSON.stringify(prodType),
    })
  },


  // 初始化函数
  initPageInfo() {
    if (app.globalData.loginStatus === 0) { 
      this.setData({
        loginStatus: 0
      })
      return 
    } else {
      this.setData({
        loginStatus: 1
      })
    }
    this.getSendProduct()
    // this.getSaleProduct()
    // this.getBuyProduct
    this.getStarProduct()
  },

  // 页面第一次进入初始化数据
  onLoad: function () {
    this.initPageInfo()
  },

  // 下拉更新数据
  onPullDownRefresh: function () {
    this.initPageInfo()
    wx.showToast({
      icon: 'loading',
      title: '加载中',
    })
    wx.stopPullDownRefresh({})
  },
})