// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(context)
  return db.collection('data')
    .where({
      name: new db.RegExp({
        regexp: 'krisli-0[1-9]', // 匹配krili-01 ··· krisli-09
        options: 'i'
      })
    })
    .get()
}