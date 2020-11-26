// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

var rp = require('request-promise');

//
// 云函数入口函数
exports.main = async (event, context) => {
  //
  console.log(event);
  return rp(`http://t.yushu.im/v2/movie/subject/${event.mid}`).then(function(res){
    
    return res;
  }).catch(function(err){
    return err;
  });
}
