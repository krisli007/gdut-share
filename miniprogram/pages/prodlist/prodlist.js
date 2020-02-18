// miniprogram/pages/prodlist/prodlist.js
Page({

  data: {
    prodList: null
  },

  onLoad: function (options) {

    this.setData({
      prodList:  JSON.parse(options.prodlist).reverse()
    })    
    console.log(options.index);
    
    new Promise((resolve) => {
      let index = options.index
      console.log('2');
      let text = ''
      switch (index) {
        case '0':
          text = '我的发布';
          break;
        case '1':
          text = '我卖出的';
          break;
        case '2':
          text = '我买到的';
          break;
        case '3':
          text = '我的收藏';
          break;
      }
      console.log('3');
      resolve(text);
    }).then(text => {
      // 动态设置导航栏标题
      wx.setNavigationBarTitle({
        title: text
      })
    })
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

})