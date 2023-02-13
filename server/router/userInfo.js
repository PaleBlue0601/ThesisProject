const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const db = require('../db/index')

//获取用户信息
router.post('/getuserinfo', async (req, res) => {
  const { userID } = req.body
  const rows = await db.find('user_info', { userID })
  if (rows.length > 0) {
    req.body = ({ success: true, message: "用户信息查询成功", data: rows[0] })
  } else {
    req.body = ({ success: false, message: "用户信息查询失败", data: [] })
  }
  res.send(req.body)
})

//修改用户信息
router.post('/updateuserinfo', async (req, res) => {
  const { data, userID } = req.body
  const key = Object.getOwnPropertyNames(data)[0]
  if (key === 'avatarPath') {
    // 删除旧的图片
    const oldRows = await db.find('user_info', { userID })
    if (oldRows.length > 0) {
      const { avatarPath } = oldRows[0]
      if (avatarPath != null) {
        const filePath = path.join(__dirname, `../public/images/${avatarPath}`)
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            return false
          }
          console.log('删除旧头像成功');
        })
      }
    }
  }
  await db.update('user_info', [data, { userID }])
  const rows = await db.find('user_info', { userID })
  if (rows.length > 0 && key !== undefined) {
    const row = rows[0]
    if (row[key] != data[key]) {
      req.body = { success: false, message: "修改失败" }
    } else {
      req.body = { success: true, message: "修改成功", data: row }
    }
  }
  res.send(req.body)
})

// 个人成就
router.post('/userinfo/achievement', async (req, res) => {
  const { userID } = req.body
  const data = {
    views: 0,
    likes: 0,
    collections: 0
  }
  const objectRows = await db.find('object_info', [{userID}])
  const objectRowsLen = objectRows.length
  if(objectRowsLen > 0) {
    data.collections = objectRowsLen
    objectRows.forEach(row => {
      const { views, likes } = row
      data.views += views || 0
      data.likes += likes || 0
    });
    req.body = {success: true, message: "成就查询成功", data}
  } else {
    req.body = {success: false, message: "成就查询失败", data}
  }
  res.send(req.body)
})

module.exports = router