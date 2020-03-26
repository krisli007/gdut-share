// miniprogram/pages/product/product.js
const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/util')

Page({
    data: {
        // product 为单件商品对象
        product: null,
        userOpenId: '',
        userType: -1,
        isLove: false,
        isStar: false,
        isComment: false,
        loveNum: '',
        comNum: '',
        starNum: '',
        commentList: null
    },
    // 去个人主页
    async toUserPage() {
        await app.checkLoginStatus()
        let openid = this.data.product._openid
        wx.navigateTo({
            url: `../userpage/userpage?openid=${openid}`,
        })
    },
    // 全屏观看图片
    previewImage(e) {
        let index = e.currentTarget.dataset.index
        wx.previewImage({
            current: this.data.product.imgIdArr[index],
            urls: this.data.product.imgIdArr
        })
    },

    // 长按显示保存照片菜单
    saveImgActionSheet(e) {
        const that = this
        wx.showActionSheet({
            itemList: ['保存照片到相册'],
            success(res) {
                if (res.tapIndex === 0) {
                    that.saveImageToPhotosAlbum(e.currentTarget.dataset.index, that)
                }
            }
        })
    },

    // 保存图片到本地
    saveImageToPhotosAlbum(index, that) {
        wx.getImageInfo({
            src: that.data.product.imgIdArr[index],
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(res) {
                        wx.showToast({
                            title: '保存照片成功'
                        })
                    }
                })
            }
        })
    },

    // 显示成功函数
    showToast(msg, icon) {
        let newIcon = icon ? icon : 'success'
        wx.showToast({
            title: msg,
            icon: newIcon,
            duration: 1000,
        })
    },

    // 像指定id的记录更新信息
    // id: 记录id
    // name: 字段名字
    // method: 方法
    // data: 字段值
    updateProduct(id, name, method, data) {
        wx.cloud.callFunction({
            name: 'updateProduct',
            data: {
                id: id,
                name: name,
                method: method,
                data: data
            }
        }).catch(err => {
            console.log(err)
        })
    },

    // 点赞收藏 评论窗口打开
    async onTouchBtmLeft(e) {
        try {
            await app.checkLoginStatus()
            console.log(e);

            let index = e.currentTarget.dataset.index
            // console.log('1为点赞，2为评论，3为收藏', index)

            let product = this.data.product
            // console.log('商品信息', product)

            let id = product._id
            // console.log('商品id', id)

            if (index === '1') {
                this.setData({
                    isLove: !this.data.isLove
                })
                if (this.data.isLove) {
                    this.updateProduct(id, 'love', 'add')
                    this.showToast('点赞成功')
                    this.setData({
                        loveNum: this.data.loveNum + 1
                    })
                } else {
                    this.updateProduct(id, 'love', 'cut')
                    this.showToast('取消点赞')
                    this.setData({
                        loveNum: this.data.loveNum - 1
                    })
                }
            } else if (index === '3') {
                this.setData({
                    isStar: !this.data.isStar
                })
                if (this.data.isStar) {
                    this.updateProduct(id, 'star', 'add')
                    this.showToast('收藏成功')
                    this.setData({
                        starNum: this.data.starNum + 1
                    })
                } else {
                    this.updateProduct(id, 'star', 'cut')
                    this.showToast('取消收藏')
                    this.setData({
                        starNum: this.data.starNum - 1
                    })
                }
            } else {
                this.setData({
                    isComment: !this.data.isComment
                })
            }
        } catch (error) {
            console.error(error)
        }
    },

    // 评论窗口隐藏
    hideInputComment() {
        this.setData({
            isComment: !this.data.isComment
        })
    },

    // 发送评论
    sendComment(e) {
        let content = e.detail.value
        if (content === '') {
            this.showToast('评论内容不能为空', 'none')
            this.setData({
                isComment: !this.data.isComment
            })
            return
        }
        let userOpenId = this.data.userOpenId
        let {
            avatarUrl,
            nickName
        } = app.globalData.userInfo
        let date = util.formatTime(new Date())
        let comment = {
            'openid': userOpenId,
            'avatarUrl': avatarUrl,
            'nickName': nickName,
            'content': content,
            'date': date
        }
        let product = this.data.product
        let id = product._id
        this.updateProduct(id, 'comment', 'add', comment)
        this.showToast('评论成功')
        // unshift()改变原数组，返回新的长度
        product.comment.unshift(comment)
        this.setData({
            comNum: this.data.comNum + 1,
            commentList: product.comment
        })
    },

    // 管理互动操作菜单
    async manageActionSheet() {
        try {
            await app.checkLoginStatus()
            const that = this
            let prod = this.data.product
            if (prod.status === 0) {
                wx.showActionSheet({
                    itemList: ['已转手', '编辑', '删除'],
                    success(res) {
                        if (res.tapIndex === 0) {
                            that.changeProdStatus()
                        } else if (res.tapIndex === 1) {
                            that.toEditProduct()
                        } else {
                            that.deleteProduct()
                        }
                    }
                })
            } else {
                wx.showActionSheet({
                    itemList: ['删除'],
                    success(res) {
                        that.deleteProduct()
                    }
                })
            }
        } catch (e) {
            console.error(e);
        }
    },

    // 已转手
    changeProdStatus () {
        let prod = this.data.product
        let id = prod._id
        wx.showModal({
            title: '确定要关闭该发布信息吗？',
            content: '关闭之后他人则不能私聊你',
            confirmText: '确定关闭',
            cancelText: '我再想想',
            success: (res) => { 
                if (res.confirm) {
                    db.collection('product').doc(id).update({
                        data: {
                            status: 1
                        },
                    })
                }
            }
        })
    },

    // 编辑
    toEditProduct() {
        let prod = this.data.product
        wx.redirectTo({
            url: '../edit/edit?prodInfo=' + JSON.stringify(prod),
        })
    },

    // 删除
    deleteProduct() {
        const that = this
        wx.showModal({
            title: '注意！',
            content: '确定要删除吗？',
            confirmText: '确定删除',
            cancelText: '我再想想',
            success: (res) => {
                if (res.confirm) {
                    // 删除商品逻辑
                    wx.cloud.callFunction({
                        name: 'deleteProduct',
                        data: {
                            id: that.data.product._id
                        }
                    })
                    that.showToast('删除成功')
                    setTimeout(() => {
                        that.showToast('正在跳转首页', 'loading')
                        setTimeout(() => {
                            wx.switchTab({
                                url: '../disc/disc',
                            })
                        }, 1000);
                    }, 1000);
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
        })
    },

    // “我想要”跳转私聊
    async toSaler() {
        await app.checkLoginStatus()
        let prod = this.data.product
        if (prod.status === 1) {
            return
        }
        let prodOpenId = prod._openid
        let prodUserInfo = prod.userInfo
        let buyUserOpenId = this.data.userOpenId
        console.log(this.data.userOpenId);
        wx.navigateTo({
            url: `../p2pchat/p2pchat?prodOpenId=${prodOpenId}&buyUserOpenId=${buyUserOpenId}&prodUserInfo=` + JSON.stringify(prodUserInfo),
        })
    },

    // 调用云函数获取单件商品信息
    getProductInfo(id, that) {
        return (resolve, reject) => {
            wx.cloud.callFunction({
                name: 'getProductInfo',
                data: {
                    method: 'getId',
                    id: id
                }
            }).then(res => {
                console.log('getId通过id来查找商品信息', res);

                that.setData({
                    product: res.result.data
                })
                resolve(res)
            }).catch(err => {
                console.error(err)
                reject(err)
            })
        }
    },

    // 初始化页面数据
    initProductInfo(prod, that) {
        let userOpenId = null
        // 调用云函数获取 userOpenid
        wx.cloud.callFunction({
            name: 'getUserOpenId'
        }).then(res => {
            console.log('得到userOpenId', res);
            userOpenId = res.result.userInfo.openId
            that.setData({
                userOpenId: userOpenId,
                loveNum: prod.love.length,
                starNum: prod.star.length,
                comNum: prod.comment.length,
                commentList: prod.comment,
                // 判断该用户有没有点过赞
                isLove: prod.love.indexOf(userOpenId) !== -1 ? true : false,
                // 判断该用户有没有点过收藏
                isStar: prod.star.indexOf(userOpenId) !== -1 ? true : false,
                // 判断用户类型  1:主人态  2:客人态
                userType: userOpenId === prod._openid ? 1 : 0
            })
        }).then(res => {
            // 清除新增评论tag
            if (userOpenId === prod._openid) {
                wx.cloud.callFunction({
                    name: 'updateProduct',
                    data: {
                        id: prod._id,
                        name: 'comment',
                        method: 'clearNum'
                    }
                })
            }
        })
    },

    onLoad: function(options) {
        console.log(options);

        // 获得url传进来的商品信息id
        const id = options.id
        const that = this
        new Promise(this.getProductInfo(id, that)).then(res => {
            let prod = this.data.product
            this.initProductInfo(prod, that)
        })
    },

    // 用户点击分享
    onShareAppMessage: function() {

    }
})