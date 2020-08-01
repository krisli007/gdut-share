//app.js
App({
    // 页面初始化
    onLaunch: function() {

        this.globalData = {
            loginStatus: 0,
            userInfo: null,
            product: null,
            // info 页消息提醒数目
            newComNum: 0,
        }
        // wx.showTabBarRedDot({
        //   index: 2
        // })
        this.cloudInit()
        this.checkSetting()
    },

    // 云开发初始化
    cloudInit() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'krisli-gdut-share',
                traceUser: true,
            })
        }
    },
    // 定时更新chat页信息
    getNewChatNum(chatPageList, userOpenId) {
        // this.checkLoginStatus()
        let newNum = 0
        console.log('获取新信息');
        if (chatPageList) {
            for (const key in chatPageList) {
                if (chatPageList.hasOwnProperty(key)) {
                    if (chatPageList[key].chatList.slice(-1) == '') {
                        console.log('没有新消息')
                    } else {
                        if (chatPageList[key].chatList.slice(-1)[0].openid !== userOpenId) {
                            newNum += chatPageList[key].num;
                        }
                    }
                }
            }
            console.log(newNum);

            if (newNum > 0) {
                wx.setTabBarBadge({
                    index: 2,
                    text: newNum + '',
                })
            } else {
                wx.removeTabBarBadge({
                    index: 2,
                })
                console.log('清除消息提醒')
            }
            return
        }
        wx.cloud.callFunction({
            name: 'getChat',
        }).then(res => {
            console.log(res.result.data, '1111111')
            const chatPageList = res.result.data
            for (const key in chatPageList) {
                if (chatPageList.hasOwnProperty(key)) {
                    console.log(chatPageList[key].num)
                    newNum += chatPageList[key].num;
                }
            }
            if (newNum > 0) {
                wx.setTabBarBadge({
                    index: 2,
                    text: newNum + '',
                })
            } else {
                wx.removeTabBarBadge({
                    index: 2,
                })
                console.log('清除消息提醒out')
            }
        })
    },

    // 每次Tab onshow 时更新info页
    async updateInfoPage() {
        let newComNum = 0
        wx.cloud.callFunction({
            name: 'getProductInfo',
            data: {
                method: 'getUserSend'
            }
        }).then(res => {
            let userSendList = res.result.data
            console.log('app里userSendList', userSendList);
            for (const item of userSendList) {
                newComNum += item.newComNum
            }
        }).then(res => {
            if (newComNum > 0) {
                wx.setTabBarBadge({
                    index: 3,
                    text: newComNum + '',
                })
                this.globalData.newComNum = newComNum
            } else {
                wx.removeTabBarBadge({
                    index: 3,
                })
                this.globalData.newComNum = 0
            }
        })
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
            success(res) {
                // 为 true 即已授权

                if (res['authSetting']['scope.userInfo']) {
                    console.log('已授权');
                    that.getUserInfo()
                    that.globalData.loginStatus = 1
                    that.getNewChatNum()
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
            lang: 'zh_CN',
            complete: (res) => {
                that.globalData.userInfo = res.userInfo
                wx.cloud.callFunction({
                    name: 'updateUser',
                    data: {
                        userInfo: res.userInfo
                    }
                })
            },
        })
    }

})