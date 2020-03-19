// pages/test/test.js
const app = getApp()
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatus: 0,
    backgroundAudioManager: null,
    chatPageList: null,
    userOpenId: null,
    isShow: 0,
    timer: null,
  },
  top2pchat(e) {
    let index = e.currentTarget.dataset.index
    let chatItem = this.data.chatPageList[index]
    let userOpenId = this.data.userOpenId
    if (userOpenId === chatItem.buyOpenId ) {
      wx.navigateTo({
        url: `../p2pchat/p2pchat?prodOpenId=${chatItem.prodOpenId}&buyUserOpenId=${userOpenId}&prodUserInfo=` + JSON.stringify(chatItem.prodUserInfo),
      })
    } else {
      wx.navigateTo({
        url: `../p2pchat/p2pchat?prodOpenId=${chatItem.buyOpenId}&buyUserOpenId=${userOpenId}&prodUserInfo=` + JSON.stringify(chatItem.buyUserInfo),
      }) 
    }
  },

  // pauseBgm() {
  //   this.data.backgroundAudioManager.pause()
  // },
  // playBgm() {
  //   this.data.backgroundAudioManager.play()
  // },
  // stopBgm() {
  //   this.data.backgroundAudioManager.stop()
  // },

  // 播放背景音乐
  backgroundAudio() {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    this.setData({
      backgroundAudioManager: backgroundAudioManager
    })
    // 进入页面后自动播放背景音乐
    backgroundAudioManager.title = '说好不哭'
    backgroundAudioManager.epname = '说好不哭'
    backgroundAudioManager.singer = '周杰伦'
    backgroundAudioManager.coverImgUrl = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000000Eytsu48dRJP.jpg?max_age=2592000'
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = 'http://www.krislee.xyz/mini/testCry.mp3'
  },

  getNewChat() {
    const that = this
    // 调用云函数获取 userOpenid
    wx.cloud.callFunction({
      name: 'getUserOpenId'
    }).then(res => {
      console.log('getUserOpenId', res);
      
      let userOpenId = res.result.userInfo.openId
      wx.cloud.callFunction({
        name: 'getChat',
      }).then(res => {
        console.log('getChat', res);
        
        const chatPageList = res.result.data
        that.setData({
          chatPageList: chatPageList,
          userOpenId: userOpenId,
        })
        app.getNewChatNum(chatPageList,userOpenId)
        
      })
    })
  }, 
  async initChatPage() {
    await app.checkLoginStatus()
    app.updateInfoPage()
    this.getNewChat()
    this.data.timer =setInterval(() => {
      this.getNewChat()
      console.log('okok');
    }, 10000);
    this.setData({
      loginStatus: 1,
    })
  },
  onLoad: function (options) {
    this.backgroundAudio()
  },

  onShow: function () {
    this.initChatPage()
  },

  onHide: function () {
    clearInterval(this.data.timer)
    console.log('clear');
  },

  onPullDownRefresh: function () {
    wx.showToast({
      icon: 'loading',
      title: '加载中',
    })
    wx.stopPullDownRefresh({
    })
  },

})