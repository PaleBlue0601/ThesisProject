const express = require('express')
const router = express.Router()
const db = require('../db/index')

// 获取所有用户信息
router.post('/usermanagement/getuserinfos', async (req, res) => {
  const { key } = req.body
  let sql = `SELECT * FROM user_info WHERE petName LIKE '%${key}%' AND status!='admin'`
  const rows = await db.customQuery(sql)
  let data = []
  if (rows.length > 0) {
    data = rows
  }
  req.body = { success: true, message: "查询成功", data }
  res.send(req.body)
})

// 修改用户身份
router.post('/usermanagement/statusedit', async (req, res) => {
  const { status, userID } = req.body
  await db.update('user_info', [{ status }, { userID }])
  const rows = await db.find('user_info', { userID })
  if (rows.length > 0) {
    const row = rows[0]
    if (row.status == status) {
      req.body = { success: true, message: "修改成功" }
    } else {
      req.body = { success: false, message: "修改失败" }
    }
  }
  res.send(req.body)
})

module.exports = router