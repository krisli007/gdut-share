// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
// 传入参数：method
exports.main = async(event, context) => {
    const {
        OPENID
    } = cloud.getWXContext()
    return {
        openid: OPENID,
    }
}