const moment = require('moment');
moment.locale('zh-cn');
/*获取现在的时间*/
exports.getNowTime = () =>{
    let time = new Date();
    return moment(time).valueOf()
}
//获取分页列表处理sql语句的方法
exports.getList = (pageNum,pageSize) => {
    let page = parseInt(pageNum || 1);// 页码
    let end = parseInt(pageSize || 10); // 默认页数
    let start = (page - 1) * end;
    return [start,end];
}