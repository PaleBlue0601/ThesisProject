const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const upload = require('../tools/upload/upload')

// 上传文件
router.post('/file/upload', async (req, res) => {
  const imgName = await upload(req, res)
  if (imgName !== '') {
    req.body = ({ success: true, message: "上传成功", data: { imgName } })
  } else {
    req.body = ({ success: false, message: "上传失败", data: {} })
  }
  res.send(req.body)
})

// 删除文件
router.post('/file/delete', async (req, res) => {
  const { imgName } = req.body
  if (imgName === null) {
    req.body = { success: false, message: "图片名称不能为空" }
  } else {
    const filePath = path.join(__dirname, `../public/images/${imgName}`)
    await fs.unlink(filePath, (err) => {
      if (err) {
        req.body = { success: false, message: "图片删除失败" }
        return false
      }
    })
    req.body = { success: true, message: "图片删除成功" }
  }
  res.send(req.body)
})



module.exports = router