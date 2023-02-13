const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const db = require('../db/index')

// 获取去当前日期 YYYY-MM-DD
function getNowDate(dateForm) {
  const date = new Date();//当前时间
  const year = date.getFullYear() //返回指定日期的年份
  const month = date.getMonth() + 1;//月
  const day = date.getDate();//日
  const hour = date.getHours();//时
  const minute = date.getMinutes();//分
  const second = date.getSeconds();//秒

  //当前时间 
  const curTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return curTime;
}

// 添加藏品
router.post('/addpeopleobject', async (req, res) => {
  const { objectPic } = req.body
  const status = 'unexchange'
  const modifyDate = getNowDate()
  await db.insert('object_info', { ...req.body, modifyDate, status })
  const rows = await db.find('object_info', { objectPic })
  if (rows.length > 0) {
    req.body = { success: true, message: "藏品添加成功" }
  } else {
    req.body = { success: false, message: "藏品添加失败" }
  }
  res.send(req.body)
})

// 获取藏品信息
router.post('/getpeopleobjcetlist', async (req, res) => {
  const { userID } = req.body
  const rows = await db.find('object_info', { userID })
  req.body = { success: true, message: "藏品查询成功", data: rows }
  res.send(req.body)
})

// 修改藏品信息
router.post('/updatepeopleobjcet', async (req, res) => {
  const { objectID, objectName, objectDescribe, objectPic } = req.body
  const modifyDate = getNowDate()
  await db.update('object_info', [{ objectName, modifyDate, objectDescribe, objectPic }, { objectID }])
  const rows = await db.find('object_info', { objectID })
  if (rows.length > 0) {
    req.body = { success: true, message: "藏品修改成功" }
  } else {
    req.body = { success: false, message: "藏品修改失败" }
  }
  res.send(req.body)
})

// 删除藏品信息
router.post('/deletepeopleobjcet', async (req, res) => {
  const { objectIDs } = req.body
  const ids = objectIDs.join(',')
  const sql1 = `SELECT * FROM object_info WHERE objectID in(${ids})`
  const oldRows = await db.customQuery(sql1)
  // 删除藏品图片
  if (oldRows.length > 0) {
    oldRows.forEach(row => {
      const { objectPic } = row
      const filePath = path.join(__dirname, `../public/images/${objectPic}`)
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('图片删除失败')
          return false
        }
      })
    });
  }
  let sql2 = `DELETE FROM object_info WHERE objectID IN(${ids})`
  await db.deletes(sql2)
  const rows = await db.customQuery(sql1)
  if (rows.length > 0) {
    req.body = { success: false, message: "藏品删除失败" }
  } else {
    req.body = { success: true, message: "藏品删除成功" }
  }
  res.send(req.body)
})

module.exports = router