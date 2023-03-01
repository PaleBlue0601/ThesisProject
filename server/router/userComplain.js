const express = require('express')
const router = express.Router()
const db = require('../db/index')
const { getNowDate } = require('../tools/tools')

// 用户举报
router.post('/usercomplain/complain', async (req, res) => {
  const date = getNowDate()
  await db.insert('user_complains', { ...req.body, date })
  const rows = await db.find('user_complains', { date })
  if(rows.length > 0) {
    req.body = { success: true, message: "举报成功" }
  } else {
    req.body = { success: false, message: "举报失败" }
  }
  res.send(req.body)
})

// 获取举报信息
router.post('/usercomplain/getcomplains', async (req, res) => {
  const { key } = req.body
  let sql = `SELECT * FROM user_complains WHERE complainant LIKE '%${key}%' OR defendant LIKE '%${key}%'`
  const rows = await db.customQuery(sql)
  req.body = { success: true, message: "查询成功", data: rows }
  res.send(req.body)
})

// 删除举报信息
router.post('/usercomplain/delete', async (req, res) => {
  const { ids } = req.body
  const idsStr = ids.join(',')
  const deleteSql = `DELETE FROM user_complains WHERE id IN(${idsStr})`
  await db.customQuery(deleteSql)
  const findSql = `SELECT * FROM user_complains WHERE id IN(${idsStr})`
  const rows = await db.customQuery(findSql)
  if (rows.length > 0) {
    req.body = { success: false, message: "删除失败" }
  } else {
    req.body = { success: true, message: "删除成功" }
  }
  res.send(req.body)
})

module.exports = router