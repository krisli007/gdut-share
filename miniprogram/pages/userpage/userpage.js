// miniprogram/pages/userpage/userpage.js
const app = getApp()

Page({

  data: {
    pageOpenId: '',
    userType: -1,
    userInfo: null,
    careNum: 0,
    fansNum: 0,
    isCare: null,
    sendProdList: []
  },

  // 显示成功函数
  showToast(msg,icon) {
    let newIcon = icon ? icon : 'success'
    wx.showToast({
      title: msg,
      icon: newIcon,
      duration: 1000,
    })
  },

  // 关注或者已关注按钮改变
  changeCare(e) {
    let care = e.currentTarget.dataset.care
    wx.cloud.callFunction({
      name: 'updateUserCare',
      data: {
        care: care,
        pageOpenId: this.data.pageOpenId
      }
    })
    let fansNum = this.data.fansNum
    this.setData({
      isCare: !this.data.isCare,
    })
    if (this.data.isCare) {
      this.showToast('关注成功')
      this.setData({
        fansNum: fansNum + 1
      })
    } else {
      this.showToast('取关成功')
      this.setData({
        fansNum: fansNum - 1
      })
    }
  },

  // 去关注粉丝页
  toCareList(e) {
    let index = e.currentTarget.dataset.index
    let openid = this.data.pageOpenId
    if (index === '0') {
      wx.navigateTo({
        url: `../carelist/carelist?method=care&openid=${openid}`,
      })
    } else {
      wx.navigateTo({
        url: `../carelist/carelist?method=fans&openid=${openid}`,
      })
    }
  },

  // 展示TA的发布
  getPageUserSend(openid) {
    wx.cloud.callFunction({
      name: 'getProductInfo',
      data: {
        pageOpenId: openid,
        method:'getUserSend'
      }
    }).then(res => {
      console.log(res.result.data)
      this.setData({
        sendProdList: res.result.data
      })
    })
  },
  // 跳转到商详页
  toProductUrl(e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.sendProdList[index]._id
    wx.navigateTo({
      url: `../product/product?id=${id}`,
    })
  },

  onLoad: function (options) {
    let pageOpenId = options.openid
    console.log(pageOpenId);
    
    // 从info页跳转过来，一定是主人态
    if (options.agent && options.agent === 'info') {
      this.getPageUserSend()
      const nickName = app.globalData.userInfo.nickName
      wx.setNavigationBarTitle({
        title: `${nickName}的主页`
      })
      wx.cloud.callFunction({
        name: 'getUserByOpenId',
      }).then(res => {
        let user = res.result.data[0]
        this.setData({
          userType: 1,
          userInfo: user.info,
          careNum: user.care.length,
          fansNum: user.fans.length,
          pageOpenId: pageOpenId,
        })
      })
    } else {
      this.getPageUserSend(pageOpenId)
      // 从别的渠道跳进来 先获取用户openid，再跟商品openid比较
      wx.cloud.callFunction({
        name: 'getUserOpenId',
      }).then(res => {
        let userOpenId = res.result.userInfo.openId
        wx.cloud.callFunction({
          name: 'getUserByOpenId',
          data: {
            pageOpenId: pageOpenId
          }
        }).then(res => {
          let user = res.result.data[0]
          let nickName = user.info.nickName
          let fans = user.fans
          this.setData({
            userType: pageOpenId === userOpenId ? 1 : 0,
            userInfo: user.info,
            careNum: user.care.length,
            fansNum: user.fans.length,
            pageOpenId: pageOpenId,
            isCare: fans.indexOf(userOpenId) !== -1 ? true : false
          })
          wx.setNavigationBarTitle({
            title: `${nickName}的主页`
          })

        })
      })
    }
  },

  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})