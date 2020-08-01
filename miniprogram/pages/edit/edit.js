// miniprogram/pages/edit/edit.js
const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        prodInfo: null,
        category: ['数码', '运动', '美妆', '图书', '日用', '服装'],
        tempFilePaths: [],
        pickerIndex: -1,
    },

    // 选择类别
    bindPickerChange: function (e) {
        this.setData({
            pickerIndex: e.detail.value
        })
    },
    // 通过商品id来找对应图片
    getImgByProdId(id, imgArr) {
        let imgList = []
        const that = this
        wx.cloud.getTempFileURL({
            fileList: imgArr
        }).then(res => {
            let tempFilePaths = []
            for (let imgItem of res.fileList) {
                tempFilePaths.push(imgItem.tempFileURL)
                that.setData({
                    tempFilePaths: tempFilePaths
                })
            }
        }).catch(error => {
            console.error(error)
        })
    },
    // 发帖提交函数
    async formSubmit(e) {
        try {
            await app.checkLoginStatus()
            // 检查表单
            const product = e.detail.value
            if (this.checkForm(product) === 1) {
                let prodInfo = this.data.prodInfo
                let id = prodInfo._id
                // 插入新数据到商品集合
                db.collection('product').doc(id).update({
                    data: {
                        title: product.title,
                        detail: product.detail,
                        category: parseInt(product.category),
                        realAmount: product.realAmount,
                    }
                }).then(
                    wx.showToast({
                        title: '保存成功',
                        duration: 1000,
                    }),
                    setTimeout(() => {
                        wx.showToast({
                            title: '正在跳转',
                            duration: 1500,
                            icon: 'loading',
                            success: () => {
                                setTimeout(() => {
                                    wx.redirectTo({
                                        url: `../product/product?id=${id}`,
                                    })
                                }, 1500);
                            }
                        })
                    }, 1000)
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let prodInfo = JSON.parse(options.prodInfo)
        this.setData({
            prodInfo: prodInfo
        })
        console.log(prodInfo)

        this.getImgByProdId(prodInfo._id, prodInfo.imgIdArr)
    },

})