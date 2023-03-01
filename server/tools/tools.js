//生成一个随机四位数
createnum = function (n) {
  let num = "";
  for (var i = 0; i < n; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

// 获取去当前日期 YYYY-MM-DD
getNowDate = function() {
  const date = new Date();//当前时间
  const year = date.getFullYear() //返回指定日期的年份
  const month = date.getMonth() + 1;//月
  const day = date.getDate();//日
  const hour = date.getHours();//时
  const minute = date.getMinutes();//分
  const second = date.getSeconds();//秒

  //当前时间 
  const curTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return curTime;
}

module.exports = {
  createnum,
  getNowDate
}