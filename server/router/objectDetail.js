const express = require('express')
const router = express.Router()
const db = require('../db/index')

// 获取藏品信息 
router.post('/getobjectinfo', async (req, res) => {
  const { objectID } = req.body
  const rows = await db.find('object_info', { objectID })
  if (rows.length > 0) {
    req.body = { success: true, message: "藏品查询成功", data: rows }
  } else {
    req.body = { success: false, message: "藏品查询失败", data: [] }
  }
  res.send(req.body)
})

// 浏览数
router.post('/objectdetail/views', async (req, res) => {
  const { objectID, views } = req.body
  await db.update('object_info', [{ views }, { objectID }])
  const rows = await db.find('object_info', { objectID })
  const { views: newViews } = rows[0]
  if (rows.length > 0 && views === newViews) {
    req.body = { success: true, message: "浏览数修改成功", data: { newViews } }
  } else {
    req.body = { success: false, message: "浏览数修改失败", data: { newViews } }
  }
  res.send(req.body)
})

// 点赞
router.post('/objectdetail/likes', async (req, res) => {
  const { objectID, likes, whether, userID } = req.body
  await db.update('object_info', [{ likes }, { objectID }])
  let sql = `UPDATE object_likes SET ? WHERE ? AND ?`
  await db.customQuery(sql, [{ whether }, { userID }, { objectID }])
  const rows = await db.find('object_info', { objectID })
  const { likes: newLikes } = rows[0]
  if (rows.length > 0 && likes === newLikes) {
    req.body = { success: true, message: "点赞成功", data: { newLikes } }
  } else {
    req.body = { success: false, message: "点赞失败", data: { newLikes } }
  }
  res.send(req.body)
})

// 检查用户是否点赞
router.post('/objectdetail/checklike', async (req, res) => {
  const { objectID, userID } = req.body
  let sql = `SELECT * FROM object_likes WHERE ? AND ?`
  const rows = await db.customQuery(sql, [{ objectID }, { userID }])
  if (rows.length > 0) {
    const { whether } = rows[0]
    if (whether == 'yes') {
      req.body = { success: true, message: "已点赞", data: { whether } }
    } else {
      req.body = { success: true, message: "未点赞", data: { whether } }
    }
  } else {
    req.body = { success: true, message: "未点赞", data: { whether: 'no' } }
    await db.insert('object_likes', { objectID, userID, whether: 'no' })
  }
  res.send(req.body)
})

// 申请藏品交换
router.post('/objectdetail/exchange', async (req, res) => {
  const { alObjectID, rsObjectID } = req.body
  const status = 'pending'
  await db.insert('object_exchange', { ...req.body, status })
  const rows = await db.find('object_exchange', { alObjectID })
  if(rows.length > 0) {
    let sql = 'UPDATE object_info SET ? WHERE objectID IN(?)'
    await db.customQuery(sql, [{status: 'inexchange'}, [alObjectID, rsObjectID]])
    req.body = {success: true, message: "申请交换成功" }
  } else {
    req.body = {success: false, message: "申请交换失败" }
  }
  res.send(req.body)
})

module.exports = router