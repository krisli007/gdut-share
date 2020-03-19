// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command


// event 参数列表：

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const userCollection = db.collection('user')
  if (event.care === 'add') {
    // 增加event.pageOpenId到OPENID的care数组
    return userCollection.where({
      _openid: OPENID
    }).update({
      data: {
        care: _.push(event.pageOpenId)
      }
    }).then(res => {
      // 增加OPENID到event.pageOpenId的fans数组
      return userCollection.where({
        _openid: event.pageOpenId
      }).update({
        data: {
          fans: _.push(OPENID)
        }
      })
    })
  } else if (event.care === 'cancel') {
    // 减少event.pageOpenId在OPENID的care数组
    return userCollection.where({
      _openid: OPENID
    }).get().then(res => {
      let care = res.data[0].care
      care.splice(care.indexOf(event.pageOpenId),1)
      return userCollection.where({
        _openid: OPENID
      }).update({
        data: {
          care: care
        }
      }).then(res => {
        // 减少OPENID在event.pageOpenId的fans数组
        return userCollection.where({
          _openid: event.pageOpenId
        }).get().then(res => {
          let fans = res.data[0].fans
          fans.splice(fans.indexOf(OPENID),1)
          return userCollection.where({
            _openid: event.pageOpenId
          }).update({
            data: {
              fans: fans
            }
          })
        })
      })
    })
  }
}