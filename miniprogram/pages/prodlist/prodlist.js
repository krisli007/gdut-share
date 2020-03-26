// miniprogram/pages/prodlist/prodlist.js
const app = getApp()
Page({

    data: {
        prodList: null
    },

    // 跳转到商详页
    toProductUrl(e) {
        let index = e.currentTarget.dataset.index
        let id = this.data.prodList[index]._id
        wx.navigateTo({
            url: `../product/product?id=${id}`,
        })
    },

    onLoad: function(options) {

        this.setData({
            prodList: JSON.parse(options.prodlist).reverse()
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

    onShow: function() {

    },

    onPullDownRefresh: function() {

    },

})