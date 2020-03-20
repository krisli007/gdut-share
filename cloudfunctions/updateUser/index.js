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
    const {
        OPENID
    } = wxContext
    const collectionUser = db.collection('user')
    console.log(event, OPENID);

    try {
        return await collectionUser.where({
            _openid: OPENID
        }).get().then(res => {
            if (res.data.length === 0) {
                return collectionUser.add({
                    data: {
                        _openid: OPENID,
                        info: event.userInfo,
                        care: [],
                        fans: []
                    }
                })
            } else {
                return collectionUser.where({
                    _openid: OPENID
                }).update({
                    data: {
                        info: event.userInfo
                    }
                })
            }
        })
    } catch (err) {
        console.error('fisrtError:', err);
    }
}