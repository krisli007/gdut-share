// pages/info/info.js
const db = wx.cloud.database()
const _ = db.command

const app = getApp()

Page({

    data: {
        loginStatus: 0,
        careNum: '',
        fansNum: '',
        newComNum: null,
        sendProduct: null,
        saleProduct: null,
        buyProduct: null,
        starProduct: null,
    },

    // 第一次登录获得用户授权信息并且更新到数据库
    getUserInfo(e) {
        console.log(e);

        app.globalData.userInfo = e.detail.userInfo
        wx.cloud.callFunction({
            name: 'updateUser',
            data: {
                userInfo: e.detail.userInfo
            }
        })
        app.globalData.loginStatus = 1,
            this.setData({
                loginStatus: 1
            })
        this.initPageInfo()
    },
    // 去个人主页
    async toUserPage() {
        await app.checkLoginStatus()
        wx.navigateTo({
            url: `../userpage/userpage?agent=info`,
        })
    },
    // 去设置页 
    async toSettingPage() {
        await app.checkLoginStatus()
        wx.navigateTo({
            url: '../settingpage/settingpage',
        })
    },
    // 去关注粉丝页
    async toCareList(e) {
        await app.checkLoginStatus()
        let index = e.currentTarget.dataset.index
        if (index === '0') {
            wx.navigateTo({
                url: '../carelist/carelist?method=care',
            })
        } else {
            wx.navigateTo({
                url: '../carelist/carelist?method=fans',
            })
        }
    },
    // 获取关注粉丝数量
    async getCareFansNum() {
        await app.checkLoginStatus()
        wx.cloud.callFunction({
            name: 'getUserByOpenId',
        }).then(res => {
            console.log(res);

            let user = res.result.data[0]
            let care = user.care
            let fans = user.fans
            this.setData({
                careNum: care.length,
                fansNum: fans.length,
            })
        })
    },

    // 我发布的
    getSendProduct() {
        const that = this
        wx.cloud.callFunction({
            name: 'getProductInfo',
            data: {
                method: 'getUserSend'
            }
        }).then(res => {
            that.setData({
                sendProduct: res.result.data
            })
        })
    },
    // 我卖出的 
    getSaleProduct() {
        const that = this
        wx.cloud.callFunction({
            name: 'getProductInfo',
            data: {
                method: 'getUserSale'
            }
        }).then(res => {
            that.setData({
                sendProduct: res.result.data
            })
        })
    },
    // 我买到的
    getBuyProduct() {

    },
    // 我收藏的
    getStarProduct() {
        const that = this
        wx.cloud.callFunction({
            name: 'getProductInfo',
            data: {
                method: 'getUserStar'
            }
        }).then(res => {
            that.setData({
                starProduct: res.result.data
            })
        })
    },
    // 我干的一切的商品列表
    async toUserProdListUrl(e) {
        await app.checkLoginStatus()
        let index = e.currentTarget.dataset.index
        let prodType = null
        let that = this.data

        switch (index) {
            case '0':
                prodType = that.sendProduct
                break;
            case '1':
                prodType = that.saleProduct
                break;
            case '2':
                prodType = that.buyProduct
                break;
            case '3':
                prodType = that.starProduct
                break;
        }
        wx.navigateTo({
            url: `../prodlist/prodlist?index=${index}&prodlist=` + JSON.stringify(prodType),
        })
    },


    // 初始化函数
    async initPageInfo() {
        console.log(app.globalData.loginStatus);

        if (app.globalData.loginStatus === 0) {
            this.setData({
                loginStatus: 0
            })
            return
        } else {
            this.setData({
                loginStatus: 1,
                newComNum: app.globalData.newComNum
            })
        }
        this.getCareFansNum()
        this.getSendProduct()
        // this.getSaleProduct()
        // this.getBuyProduct
        this.getStarProduct()

        // 清除我发布的信息标志
        app.updateInfoPage()
        setTimeout(() => {
            this.setData({
                newComNum: app.globalData.newComNum
            })
        }, 1000);
    },

    // 页面进入初始化或者更新数据
    onShow: function() {
        this.initPageInfo()
        app.updateInfoPage()
        app.getNewChatNum()

    },
    // 下拉更新数据
    onPullDownRefresh: function() {
        this.initPageInfo()
        wx.showToast({
            icon: 'loading',
            title: '加载中',
        })
        wx.stopPullDownRefresh({})
    },
})