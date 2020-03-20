// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
    const {
        OPENID
    } = cloud.getWXContext()
    const p2pchatCollection = db.collection('p2pchat')

    // 传入pageOpenId 和 OPENID 组成一个数组，成为每个私聊的唯一判断 
    const id = [OPENID, event.prodOpenId]
    const idList = [
        [OPENID, event.prodOpenId],
        [event.prodOpenId, OPENID]
    ]

    if (event.method === 'clearNewChatTag') {
        return p2pchatCollection.where({
            chatid: _.in(idList)
        }).get().then(res => {
            let chatItem = res.data[0]
            if (chatItem.chatList.slice(-1)[0].openid !== OPENID && chatItem.num > 0) {
                return p2pchatCollection.where({
                    chatid: _.in(idList)
                }).update({
                    data: {
                        num: 0
                    }
                })
            } else {
                return
            }
        })
    }

    // 在点击我想要之后，判断数据库是否存在这条私聊
    // 如果不存在，则创建
    // 如果存在，则获取信息。
    // 每条信息包含 发送者openid 内容chatList 日期date
    if (event.prodOpenId) {
        return p2pchatCollection.where({
            chatid: _.in(idList)
        }).get().then(res => {
            if (res.data == '') {
                return p2pchatCollection.add({
                    data: {
                        chatid: id,
                        chatList: [],
                        creatTime: new Date(),
                        prodOpenId: event.prodOpenId,
                        buyOpenId: OPENID,
                        prodUserInfo: event.prodUserInfo,
                        buyUserInfo: event.buyUserInfo,
                        num: 0,
                    }
                })
            } else {
                return res
            }
        })
    } else {
        // get all chat in chat page
        return p2pchatCollection.where({
            chatid: OPENID
        }).get()
    }
}