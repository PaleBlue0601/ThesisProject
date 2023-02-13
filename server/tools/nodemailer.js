const nodemailer = require('nodemailer');

//创建一个smtp服务器
const config = {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: '1303461483@qq.com',
        pass: 'pwxtjhzrhcfngdeh' //邮箱的授权码
    }
};
// 创建一个smtp客户端对象
const transporter = nodemailer.createTransport(config);
 
//发送邮件
module.exports = function (mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};