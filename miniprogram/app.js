//app.js
App({
  // 页面初始化
  onLaunch: function () {

    this.globalData = {
      loginStatus: 0,
      userInfo: null,
      product: null
    }
    wx.showTabBarRedDot({
      index: 2
    })
    wx.setTabBarBadge({
      index: 3,
      text: '1',
    })
    this.cloudInit()
    this.checkSetting()
  },

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

  // 随便逛逛后每个操作都要执行检查用户的登录态（全局变量）
  checkLoginStatus() {
    return new Promise((resolve, reject) => {
      if (this.globalData.loginStatus === 1) {
        resolve('用户已授权')
      } else {
        this.showNoLoginModal()
        reject('用户未授权')
      }
    })
  },

  // 每次进入页面检查用户登录态
  checkSetting() {
    const that = this
    wx.getSetting({
      withSubscriptions: true,
      success (res) {
        // 为 true 即已授权
        if(res['authSetting']['scope.userInfo']) {
          wx.showToast({
            title: '已经授权',
          })
          that.getUserInfo()
          that.globalData.loginStatus = 1
        } else {
          that.showNoLoginModal()
        }
      }
    })
  },

  // 没有授权显示的信息
  showNoLoginModal() {
    wx.showModal({
      title: '尊敬的用户',
      content: '您尚未登录，要去登录吗？',
      cancelText: '随便逛逛',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '../info/info',
          })
          console.log('用户去授权页')
        } else if (res.cancel) {
          console.log('用户点击取消')
          
        }
      },
    })
  },

  // 授权后每次进入页面时更新用户的最新信息
  getUserInfo() {
    const that = this
    wx.getUserInfo({
      complete: (res) => {
        that.globalData.userInfo = res.userInfo
      },
    })
  }

})
