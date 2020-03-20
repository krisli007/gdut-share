// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command


// event 参数列表：
// pageOpenId: 主页所有者openid
// 

exports.main = async(event, context) => {
    const {
        OPENID
    } = cloud.getWXContext()
    console.log(event.pageOpenId);
    console.log(event.pageOpenId ? '1' : '0');

    const newOpenId = event.pageOpenId ? event.pageOpenId : OPENID
    if (event.method === 'care') {
        // 我关注 是在别人粉丝中
        return db.collection('user').where({
            fans: newOpenId
        }).get()
    } else if (event.method === 'fans') {
        return db.collection('user').where({
            care: newOpenId
        }).get()
    } else {
        return db.collection('user').where({
            _openid: newOpenId
        }).get()
    }

}