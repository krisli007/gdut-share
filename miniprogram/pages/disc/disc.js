// pages/disc/disc.js

const app = getApp()

Page({

  data: {
    // 轮播图
    banner: {
      list: [
        'http://www.krislee.xyz/mini/gdut1.jpg',
        'http://www.krislee.xyz/mini/gdut2.jpg',
        'http://www.krislee.xyz/mini/gdut3.jpg',
        'http://www.krislee.xyz/mini/gdut4.jpg',
        'http://www.krislee.xyz/mini/gdut5.jpg',
      ],
      indicatorDots: false,
      autoplay: true,
      interval: 3500,
      duration: 1000,
      circular: true
    },
    // 吸顶选项内容
    category: {
      list: ['数码','运动','美妆','图书','日用','服装']
    },
    // 吸顶当前索引值
    categoryIndex: 0,
    // 吸顶条件
    categoryFixed: false,
    // 商品信息
    product: null
  },

  // 切换吸顶选项卡
  switchTab(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({
      categoryIndex: e.currentTarget.dataset.index
    })
  },
  
  // 监听页面滚动，判断是否要吸顶
  onPageScroll: function (e) {
    this.setData({
      categoryFixed: e.scrollTop > 254
    })
  },

  // 监听页面加载
  onLoad: function (options) {

    // 将全局变量里的商品信息赋值给页面的product变量
    // this.setData({
    //   product: app.globalData.product
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 将全局变量里的商品信息赋值给页面的product变量
    this.setData({
      product: app.globalData.product
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})