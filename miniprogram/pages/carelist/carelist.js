// miniprogram/pages/carelist/carelist.js
Page({

  data: {
    carefansList: null
  },
  toUserPage(e) {
    let index = e.currentTarget.dataset.index
    let openid = this.data.carefansList[index]._openid
    wx.navigateTo({
      url: `../userpage/userpage?openid=${openid}`,
    })
  },
  onLoad: function (options) {
    // method : care || fans
    console.log(options.method);
    console.log(pageOpenId);
    
    let method = options.method
    let pageOpenId = options.openid
    // 有pageOpenId代表从个人主页进，没有代表从info页
    wx.cloud.callFunction({
      name: 'getUserByOpenId',
      data: {
        pageOpenId: pageOpenId,
        method: method
      }
    }).then(res => {
      console.log('getUserByOpenId',res);
      
      this.setData({
        carefansList: res.result.data
      })
      wx.setNavigationBarTitle({
        title: method === 'care' ? 'TA 的关注' : 'TA 的粉丝'
      })
    })
  },

})