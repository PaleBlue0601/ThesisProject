const express = require('express')
const router = express.Router()
const db = require('../db/index')
const nodemail = require('../tools/nodemailer')
const { createnum } = require('../tools/tools')

//注册
router.post('/register', async (req, res) => {
  const { userName, code, password } = req.body
  const isLive = 'yes'
  const rows = await db.find('user_name_password', { userName })
  if (rows.length > 0) {
    const { isLive: rowIsLIve, code: rowCode, userID } = rows[0]
    if (rowIsLIve !== 'no') {
      req.body = { success: false, message: "账号已注册" }
    } else if(rowCode !== code){
      req.body = { success: false, message: "验证码错误" }
    } else {
      await db.update('user_name_password', [{ password, isLive }, { userName }])
      await db.insert('user_info', {userID, petName: userName})
      req.body = { success: true, message: "注册成功"}
    }
  } else {
    req.body = { success: false, message: "注册失败，服务器出现问题" }
  }
  res.send(req.body)
})

//登录
router.post('/login', async (req, res) => {
  const { userName, password } = req.body
  const rows = await db.find('user_name_password', { userName })
  if (rows.length > 0) {
    const { password: rowPassword } = rows[0]
    if (rowPassword !== password) {
      req.body = { success: false, message: "密码错误" }
    } else {
      req.body = { success: true, message: "登录成功", data: rows[0] }
    }
  } else {
    req.body = { success: false, message: "登录失败，账号不存在" }
  }
  res.send(req.body)
})

//发送邮箱验证码
router.post('/email', async (req, res) => {
  await db.delete('user_name_password', { isLive: 'no' })
  const { userName, mailbox } = req.body
  const isLive = 'no'
  const code = await createnum(4)
  const rows = await db.find('user_name_password', { userName })
  if (rows.length > 0) {
    req.body = { success: false, message: "账号已经存在" }
  } else {
    let mail = {
      // 发件人
      from: '<1303461483@qq.com>',
      // 主题
      subject: '注册个人藏品交换管理系统账号',//邮箱主题
      // 收件人
      to: mailbox,//前台传过来的邮箱
      // 邮件内容，html格式
      html: `<h2>${code}</h2> 作为你的验证码`//发送验证码
    }
    const data = { userName, code, isLive }
    await db.insert('user_name_password', data)
    await nodemail(mail)
    req.body = { success: true, message: "验证码发送成功" };
  }
  res.send(req.body)
})


module.exports = router