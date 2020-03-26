// miniprogram/pages/p2pchat/p2pchat.js

const app = getApp()

const util = require('../../utils/util')

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        chatList: null,
        prodUserInfo: null,
        prodOpenId: null,
        buyUserInfo: null,
        buyUserOpenId: null,
        clear: '',
        isShow: 0,
        toLast: null,
        timer: null
    },
    toUserPage(e) {

    },
    getFocus(e) {
        console.log(e);

    },
    // 发送信息
    sendMsg(e) {
        let content = e.detail.value
        if (content === '') {
            wx.showToast({
                title: '内容不能为空',
                duration: 1000,
                icon: 'none',
            })
            return
        }
        let msg = {
            'openid': this.data.buyUserOpenId,
            'msgType': 'text',
            'content': content,
            'sendTime': util.formatTime(new Date())
        }
        let chatList = this.data.chatList
        chatList.push(msg)
        this.setData({
            chatList: chatList,
            clear: '',
        })
        const that = this
        wx.cloud.callFunction({
            name: 'updateChat',
            data: {
                msg: msg,
                prodOpenId: this.data.prodOpenId
            }
        }).then(res => {
            that.setData({
                toLast: `item${that.data.chatList.length}`
            })
        })
    },
    // 定时获取最新信息
    getNewMsg(prodOpenId, prodUserInfo, buyUserInfo, buyUserOpenId) {
        console.log(prodOpenId);
        wx.cloud.callFunction({
            name: 'getChat',
            data: {
                method: 'clearNewChatTag',
                prodOpenId: prodOpenId
            }
        })
        const that = this
        wx.cloud.callFunction({
            name: 'getChat',
            data: {
                prodOpenId: prodOpenId,
                prodUserInfo: prodUserInfo,
                buyUserInfo: buyUserInfo
            }
        }).then(res => {
            let data = res.result.data
            that.setData({
                chatList: data ? data[0].chatList : null,
                prodUserInfo: prodUserInfo,
                prodOpenId: prodOpenId,
                buyUserInfo: buyUserInfo,
                buyUserOpenId: buyUserOpenId,
                isShow: 1,
            })
            return data
        }).then(res => {
            that.setData({
                toLast: res ? `item${that.data.chatList.length}` : 0
            })
            console.log('okok');
        })
    },
    onLoad: function(options) {
        let prodOpenId = options.prodOpenId
        let prodUserInfo = JSON.parse(options.prodUserInfo)
        let buyUserOpenId = options.buyUserOpenId
        let buyUserInfo = app.globalData.userInfo
        console.log(prodUserInfo, buyUserOpenId);

        // 动态设置导航栏标题
        wx.setNavigationBarTitle({
            title: prodUserInfo.nickName
        })
        this.getNewMsg(prodOpenId, prodUserInfo, buyUserInfo, buyUserOpenId)

        this.data.timer = setInterval(() => {
            this.getNewMsg(prodOpenId, prodUserInfo, buyUserInfo, buyUserOpenId)
        }, 5000);

    },

    onReady: function() {

    },

    onShow: function() {

    },
    onUnload() {
        clearInterval(this.data.timer)
    }
})