// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 向指定id的商品更新信息
// id: 记录id
// name: 字段名字
// method: 方法
// data: 字段值
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  // 选取数据库
  const productCollection = db.collection('product')

  // 点赞更新
  if (event.name === 'love') {
    if (event.method === 'add') {
      return productCollection.doc(event.id).update({
        data: {
          love: _.push(OPENID)
        }
      })
    } else if (event.method === 'cut') {
      // 将指定id记录的商品拿出来删除取消点赞的openid再更新到数据库
      return productCollection.doc(event.id).get().then(res => {
        let love = res.data.love
        love.splice(love.indexOf(OPENID),1)
        return productCollection.doc(event.id).update({
          data: {
            love: love
          }
        })
      })
    }
  } 
  // 收藏更新
  else if (event.name === 'star') {
    if (event.method === 'add') {
      return productCollection.doc(event.id).update({
        data: {
          star: _.push(OPENID)
        }
      })
    } else if (event.method === 'cut') {
      // 将指定id记录的商品拿出来删除取消点赞的openid再更新到数据库
      return productCollection.doc(event.id).get().then(res => {
        let star = res.data.star
        star.splice(star.indexOf(OPENID),1)
        return productCollection.doc(event.id).update({
          data: {
            star: star
          }
        })
      })
    }
  }
  // 评论更新
  else if (event.name === 'comment') {
    if (event.method === 'add') {
      return productCollection.doc(event.id).update({
        data: {
          comment: _.unshift(event.data)
        }
      })
    }
  }

}