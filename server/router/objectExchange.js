const express = require('express')
const router = express.Router()
const db = require('../db/index')

// 获取交换列表数据
router.post('/objectexchange/getlistdata', async (req, res) => {
  const { status, userID } = req.body
  let sql = `SELECT * FROM object_exchange WHERE status='pending' AND (alUserID=${userID} OR rsUserID=${userID})`
  if (status == 'success') {
    sql = `SELECT * FROM object_exchange WHERE status='success' AND (alUserID!=${userID} OR rsUserID!=${userID})`
  }
  const exchangeRows = await db.customQuery(sql)
  if (exchangeRows.length === 0) {
    res.send({ success: true, message: "无数据", data: [] })
    return;
  }

  // 将用户ID和藏品ID分别放入数组中
  const userIDsSet = new Set, objectIDs = []
  exchangeRows.forEach(row => {
    const { alUserID, rsUserID, alObjectID, rsObjectID } = row
    userIDsSet.add(alUserID)
    userIDsSet.add(rsUserID)
    objectIDs.push(alObjectID)
    objectIDs.push(rsObjectID)
  });
  const userIDs = Array.from(userIDsSet)

  // 查询用户信息和藏品信息
  let userSql = `SELECT * FROM user_info WHERE userID IN(?)`
  const userRows = await db.customQuery(userSql, [userIDs])
  let objectSql = `SELECT * FROM object_info WHERE objectID IN(?)`
  const objectRows = await db.customQuery(objectSql, [objectIDs])

  // 创建用户userID映射用户信息Map对象，和藏品objectID映射藏品信息Map对象
  const userMap = new Map(), objectMap = new Map
  if (userRows.length > 0 && objectRows.length > 0) {
    userRows.forEach(row => {
      const { userID } = row
      userMap.set(userID, row)
    });
    objectRows.forEach(row => {
      const { objectID } = row
      objectMap.set(objectID, row)
    })
    const data = []
    exchangeRows.forEach(row => {
      const { alUserID, rsUserID, alObjectID, rsObjectID, status, noneUserID, id } = row
      const alUserInfo = userMap.get(alUserID),
        rsUserInfo = userMap.get(rsUserID),
        alObjectInfo = objectMap.get(alObjectID),
        rsObjectInfo = objectMap.get(rsObjectID)
      data.push({
        status,
        noneUserID,
        id,
        applicantObejctInfo: {
          ...alUserInfo,
          ...alObjectInfo,
          isHome: true
        },
        respondentObejctInfo: {
          ...rsObjectInfo,
          ...rsUserInfo,
          isHome: true
        }
      })
    });
    req.body = { success: true, message: "获取交换列表数据成功", data }
  }
  res.send(req.body)
})

// 同意交换
router.post('/objectexchange/agreeexhange', async (req, res) => {
  const { id } = req.body
  const status = 'success'
  const rows = await db.find('object_exchange', [{ id }])
  const { alObjectID, rsObjectID } = rows[0]
  let sql = `UPDATE object_info SET status='exchangeed' WHERE objectID IN(?)`
  await db.customQuery(sql, [[alObjectID, rsObjectID]])
  await db.update('object_exchange', [{ status }, { id }])
  req.body = { success: true, message: "藏品交换成功" }
  res.send(req.body)
})

// 取消交换
router.post('/objectexchange/cancelexhange', async (req, res) => {
  const { id } = req.body
  const rows = await db.find('object_exchange', [{ id }])
  const { alObjectID, rsObjectID } = rows[0]
  let sql = `UPDATE object_info SET status='unexchange' WHERE objectID IN(?)`
  await db.customQuery(sql, [[alObjectID, rsObjectID]])
  await db.delete('object_exchange', [{ id }])
  req.body = { success: true, message: "取消成功" }
  res.send(req.body)
})

// 删除交换记录
router.post('/objectexchange/delete', async (req, res) => {
  const { id, userID } = req.body
  const rows = await db.find('object_exchange', [{ id }])
  const { alUserID, rsUserID, noneUserID } = rows[0]
  if (alUserID === noneUserID || rsUserID === noneUserID) {
    await db.delete('object_exchange', [{ id }])
  } else {
    await db.update('object_exchange', [{ noneUserID: userID }, { id }])
  }
  req.body = { success: true, message: "删除成功" }
  res.send(req.body)
})

module.exports = router