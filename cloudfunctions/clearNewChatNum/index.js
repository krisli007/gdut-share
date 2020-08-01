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
    // 
}