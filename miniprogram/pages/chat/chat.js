// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundAudioManager: null
  },
  pauseBgm() {
    this.data.backgroundAudioManager.pause()
  },
  playBgm() {
    this.data.backgroundAudioManager.play()
  },
  stopBgm() {
    this.data.backgroundAudioManager.stop()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('chatAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  onPullDownRefresh: function () {
    wx.showToast({
      icon: 'loading',
      title: '加载中',
    })
    wx.stopPullDownRefresh({})
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