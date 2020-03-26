// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command


// event 参数列表：

exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()

    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}