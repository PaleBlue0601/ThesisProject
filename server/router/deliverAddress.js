const express = require('express')
const router = express.Router()
const db = require('../db/index')

//设置默认地址
async function setDefult(ID, userID) {
  await db.update('ship_to_address', [{ isDefault: 'no' }, { userID }])
  await db.update('ship_to_address', [{ isDefault: 'yes' }, { ID }])
}

//查询邮寄地址
router.post('/getaddresslist', async (req, res) => {
  const { userID } = req.body
  const rows = await db.find('ship_to_address', { userID })
  if (rows.length > 0) {
    req.body = ({ success: true, message: "邮寄地址查询成功", data: rows })
  } else {
    req.body = ({ success: false, message: "邮寄地址查询失败", data: [] })
  }
  res.send(req.body)
})

// 添加邮寄地址
router.post('/addaddress', async (req, res) => {
  const { userID, isDefault } = req.body
  await db.insert('ship_to_address', req.body)
  let rows = await db.find('ship_to_address', { userID })
  const len = rows.length
  if (len > 0) {
    if (isDefault === 'yes') {
      await setDefult(rows[len - 1].ID, userID)
      rows = await db.find('ship_to_address', { userID })
    }
    req.body = ({ success: true, message: "邮寄地址添加成功", data: rows })
  } else {
    req.body = ({ success: false, message: "邮寄地址添加失败", data: [] })
  }
  res.send(req.body)
})

// 修改邮寄地址
router.post('/updateaddress', async (req, res) => {
  const { body, body: { ID, userID, isDefault } } = req
  await db.update('ship_to_address', [body, { ID }])
  if (isDefault === 'yes') await setDefult(ID, userID)
  const rows = await db.find('ship_to_address', { userID })
  if (rows.length > 0) {
    req.body = ({ success: true, message: "邮寄地址更新成功", data: rows })
  } else {
    req.body = ({ success: false, message: "邮寄地址更新失败", data: [] })
  }
  res.send(req.body)
})

// 删除邮寄地址
router.post('/deleteaddress', async (req, res) => {
  const { ID, userID } = req.body
  await db.delete('ship_to_address', { ID })
  const rows1 = await db.find('ship_to_address', { userID })
  const rows2 = await db.find('ship_to_address', { ID })
  if (rows2.length > 0) {
    req.body = ({ success: false, message: "邮寄地址删除失败", data: [] })
  } else {
    req.body = ({ success: true, message: "邮寄地址删除成功", data: rows1 })
  }
  res.send(req.body)
})

module.exports = router