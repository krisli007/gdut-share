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

    // 传入prodOpenId 和 OPENID 组成一个数组，成为每个私聊的唯一判断 
    const idList = [
        [OPENID, event.prodOpenId],
        [event.prodOpenId, OPENID]
    ]

    const msg = event.msg
    // 每发一条信息，就要执行此函数更新信息一次
    // 每条信息包含 发送者openid 消息msg:  类型msgType 内容content 发送日期sendTime
    return p2pchatCollection.where({
        chatid: _.in(idList)
    }).update({
        data: {
            chatList: _.push(msg),
            num: OPENID === event.prodOpenId ? 0 : _.inc(1),
        }
    })
}