const express = require('express')
const router = express.Router()
const db = require('../db/index')

// 未登录搜索
router.post('/gethomelistdata', async (req, res) => {
  const { key } = req.body
  let objectSql = `SELECT * FROM object_info`
  if(key !== '') {
    objectSql = `SELECT * FROM object_info WHERE objectName LIKE '%${key}%'`
  }
  const objectRows = await db.customQuery(objectSql)
  if (objectRows.length > 0) {
    // 第三步获取查询到的藏品持有者的用户信息
    const userIDSet = new Set()
    objectRows.forEach(row => {
      userIDSet.add(row.userID)
    })
    const userSql = `SELECT * FROM user_info WHERE userID IN(${Array.from(userIDSet).join(',')})`
    const userRows = await db.customQuery(userSql)
    const userIDMapUserInfo = {}
    userRows.forEach(row => {
      const { userID, petName, avatarPath } = row
      userIDMapUserInfo[userID] = {
        petName,
        avatarPath
      }
    })
    // 第四步将用户信息赋值到查询结果中
    const data = objectRows.map(row => {
      row = {
        ...row,
        ...userIDMapUserInfo[row.userID]
      }
      return row
    })
    req.body = { success: true, message: "搜索成功", data }
  } else {
    req.body = { success: false, message: "搜索失败", data: [] }
  }
  res.send(req.body)
})

// 登录后搜索
router.post('/search', async (req, res) => {
  const { userID, key } = req.body
  // 第一步查询用户
  let userSql = `SELECT * FROM user_info WHERE userID!=${userID} AND petName LIKE '%${key}%'`
  if(userID == undefined) {
    userSql = `SELECT * FROM user_info WHERE petName LIKE '%${key}%'`
  }
  const userRows = await db.customQuery(userSql)
  const userIDs = []
  if (userRows.length > 0) {
    userRows.forEach(row => {
      userIDs.push(row.userID)
    });
  }
  // 第二步查询藏品
  let objectSql = `SELECT * FROM object_info WHERE userID!=${userID} AND (objectName LIKE '%${key}%')`
  if (userIDs.join(',') !== '') {
    objectSql = `SELECT * FROM object_info WHERE userID!=${userID} AND (objectName LIKE '%${key}%' OR userID IN(${userIDs.join(',')}))`
  }
  const objectRows = await db.customQuery(objectSql)
  if (objectRows.length > 0) {
    // 第三步获取查询到的藏品持有者的用户信息
    const userIDSet = new Set()
    objectRows.forEach(row => {
      userIDSet.add(row.userID)
    })
    const userSql2 = `SELECT * FROM user_info WHERE userID IN(${Array.from(userIDSet).join(',')})`
    const userRows2 = await db.customQuery(userSql2)
    const userIDMapUserInfo = {}
    userRows2.forEach(row => {
      const { userID, petName, avatarPath } = row
      userIDMapUserInfo[userID] = {
        petName,
        avatarPath
      }
    })
    // 第四步将用户信息赋值到查询结果中
    const data = objectRows.map(row => {
      row = {
        ...row,
        ...userIDMapUserInfo[row.userID]
      }
      return row
    })
    req.body = { success: true, message: "搜索成功", data }
  } else {
    req.body = { success: false, message: "搜索失败", data: [] }
  }
  res.send(req.body)
})

module.exports = router