// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
// 传入参数: id
exports.main = async(event, context) => {
    const {
        OPENID
    } = cloud.getWXContext()
    // 选取数据库
    const productCollection = db.collection('product')
    return productCollection.doc(event.id).remove({})
}