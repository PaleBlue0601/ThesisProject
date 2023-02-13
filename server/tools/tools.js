//生成一个随机四位数
createnum = function (n) {
  let num = "";
  for (var i = 0; i < n; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

module.exports = {
  createnum
}