// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
// 传入参数：method, id
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const productCollection = db.collection('product')

  if (event.method === 'getAll') {
    // 获取全部商品信息列表
    return productCollection.get()
  } 
  else if (event.method === 'getId') {
    // 根据传入id获取单个商品信息
    return productCollection.doc(event.id).get()
  }
  else if (event.method === 'getUserSend') {
    return productCollection.where({
      _openid: OPENID
    }).get()
  }
  else if (event.method === 'getUserStar') {
    return productCollection.where({
      star: OPENID
    }).get()
  }

}