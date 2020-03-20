//index.js

const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/util')

Page({
    data: {
        category: ['数码', '运动', '美妆', '图书', '日用', '服装'],
        default: '',
        pickerIndex: -1,
        tempFilePaths: []
    },

    // 选择类别
    bindPickerChange: function(e) {
        this.setData({
            pickerIndex: e.detail.value
        })
    },
    // 选择图片
    choseImg() {
        let that = this
        wx.chooseImage({
            count: 9,
            sizeType: 'compressed',
            sourceType: ['album', 'camera'],
            success(res) {
                // 得到照片临时链接数组
                let tempFilePaths = that.data.tempFilePaths.concat(res.tempFilePaths)
                let lastTempFilePaths = []
                if (tempFilePaths.length > 9) {
                    lastTempFilePaths = tempFilePaths.slice(0, 9)
                    console.log(lastTempFilePaths)
                    wx.showToast({
                        title: '最多上传9张图片！',
                        icon: 'loading',
                        duration: 2000,
                    })
                } else {
                    lastTempFilePaths = tempFilePaths
                }
                that.setData({
                    tempFilePaths: lastTempFilePaths
                })
            }
        })
    },
    // 删除已选择图片
    deleteImg(e) {
        let index = e.currentTarget.dataset.index
        this.data.tempFilePaths.splice(index, 1)
        this.setData({
            tempFilePaths: this.data.tempFilePaths
        })
    },

    // 发帖提交函数
    async formSubmit(e) {
        try {
            await app.checkLoginStatus()

            // 检查表单
            const product = e.detail.value
            if (this.checkForm(product) === 1) {
                // 插入新数据到商品集合
                db.collection('product').add({
                    data: {
                        title: product.title,
                        detail: product.detail,
                        category: parseInt(product.category),
                        userInfo: app.globalData.userInfo,
                        realAmount: product.realAmount,
                        date: util.formatTime(new Date()),
                        imgIdArr: [],
                        love: [],
                        comment: [],
                        star: []
                    }
                }).then(res => {
                    // 上传图片
                    this.uploadFile(res._id)
                }).then(
                    wx.showToast({
                        title: '发帖成功',
                        duration: 1000,
                    }),
                    this.setData({
                        default: '',
                        pickerIndex: -1,
                        realAmount: ''
                    }),
                    setTimeout(() => {
                        wx.showToast({
                            title: '正在跳转首页',
                            duration: 1500,
                            icon: 'loading',
                            success: () => {
                                setTimeout(() => {
                                    wx.switchTab({
                                        url: '../disc/disc',
                                    })
                                }, 1500);
                            }
                        })
                    }, 1500)
                )
            } else {
                console.log('缺少信息')
            }
        } catch (error) {
            console.error(error);
        }

    },
    // 检查表单
    checkForm(product) {
        if (product.title === '') {
            this.showModal('标题')
        } else if (product.category === -1) {
            this.showModal('物品类别')
        } else if (product.realAmount === '') {
            this.showModal('价格')
        } else if (product.detail === '') {
            this.showModal('商品详情')
        } else if (this.data.tempFilePaths == '') {
            this.showModal('物品图片')
        } else {
            return 1
        }
        return 0
    },
    // 输出错误信息
    showModal(err) {
        wx.showModal({
            title: '错误信息',
            content: `${err}不能为空`
        })
    },

    // 上传图片到云存储 及 插入product集合的fileID
    uploadFile(id) {
        let imgArr = []
        for (let index in this.data.tempFilePaths) {
            wx.cloud.uploadFile({
                cloudPath: `product/${id}/${index}.png`, // 上传至云端的路径
                filePath: this.data.tempFilePaths[index], // 小程序临时文件路径
                success: res => {
                    // 返回文件 ID
                    imgArr.push(res.fileID)
                    // 插入新数据
                    db.collection('product').doc(id).update({
                        data: {
                            imgIdArr: imgArr
                        },
                    }).then(
                        this.setData({
                            tempFilePaths: [],
                        })
                    )
                },
                fail: console.error
            })
        }
    },

    onLoad: function() {

    },
    onShow: function() {
        app.getNewChatNum()
        app.updateInfoPage()
    }
})