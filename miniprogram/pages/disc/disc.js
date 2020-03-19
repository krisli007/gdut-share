// pages/disc/disc.js

const app = getApp()
import imgSource from './imgSource.js'
Page({

  data: {
    // 轮播图
    banner: {
      list: imgSource.imgSource,
      indicatorDots: false,
      autoplay: true,
      interval: 3500,
      duration: 1000,
      circular: true
    },
    // 吸顶选项内容
    category: {list: ['数码','运动','美妆','图书','日用','服装']},
    // 吸顶当前索引值
    categoryIndex: 0,
    // 吸顶条件
    categoryFixed: false,
    // 全部商品信息列表数组
    product: null,
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
  
  // 跳转到商品详情
  toProductUrl(e) {
    let product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: `../product/product?id=${product._id}`,
      success: function (res) {
        // 通过eventChannel向product页面传送数据
        res.eventChannel.emit('acceptProductInfoFromDisc', { product: product })
      }
    })
  },

  onShow: function () {
    console.log(imgSource.imgSource)
    app.updateInfoPage()
    // app.getNewChatNum()
    // 每次进入disc页面都会获取一次最新商品数据
    wx.cloud.callFunction({
      name: 'getProductInfo',
      data: {
        method: 'getAll'
      }
    }).then(res => {
      this.setData({
        product: res.result.data.reverse()
      })
    }).catch(err => {
      console.log(err)
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      icon: 'loading',
      title: '加载中',
    })
    wx.stopPullDownRefresh({})
  },
})