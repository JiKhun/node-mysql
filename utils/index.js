const moment = require('moment');
moment.locale('zh-cn');
/*获取现在的时间*/
exports.getNowTime = () =>{
    let _today = moment();
    return _today.format('YYYY-MM-DD HH:mm:ss'); 
}