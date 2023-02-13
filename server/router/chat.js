const express = require('express')
const expressWs = require('express-ws')
const db = require('../db/index')
const router = express.Router()
expressWs(router)

const clients = {} //存放连接的客户端
const messageList = {}//存放未发的消息

/**
  {
    data, //消息数据
    type, //消息类型
  }

  {
    to, //接受人id
    from, //发送人id
    content, //消息内容
    timeStamp //时间戳
  }
 */

router.ws('/chat/:id', (ws, req) => {
  const { id } = req.params
  if (id != 'undefined') {
    if (!clients[id]) {
      clients[id] = []
    }
    clients[id].push(ws)
  }
  ws.on('message', msg => {
    const { type, data } = JSON.parse(msg)
    if (type == 'message' || type == 'address' && id != 'undefined') {
      const { timeStamp } = data
      messageList[id] = messageList[id].filter(item => item.timeStamp != timeStamp)
    }
  })
  ws.on('close', (e) => {
    clients[id] = undefined
    delete clients[id]
    console.log(`client ${id} close connection`)
  })
})

// 发送消息
router.post('/chat/sendmsg', (req, res) => {
  const { to } = req.body
  const timeStamp = new Date().getTime()
  const data = { ...req.body, timeStamp }
  if (!messageList[to]) {
    messageList[to] = []
  }
  messageList[to].push(data)
  if (clients[to]) {
    clients[to].forEach(cilent => {
      cilent.send(JSON.stringify(data))
    });
  }
  req.body = { success: true, message: '发送成功' }
  res.send(req.body)
})

// 获取未接收的消息
router.post('/chat/getretainmsg', async (req, res) => {
  const { userID } = req.body
  let data = []
  if (messageList[userID]) {
    data = messageList[userID]
  }
  messageList[userID] = []
  if (data.length > 0) {
    // 获取发送者的id
    const userIDSet = new Set()
    data.forEach(item => {
      userIDSet.add(item.form)
    })
    const formIDs = Array.from(userIDSet)
    let sql = `SELECT * FROM user_info WHERE userID IN(?)`
    const rows = await db.customQuery(sql, [formIDs])
    const userMap = new Map()
    if (rows.length > 0) {
      rows.forEach(row => {
        const { userID } = row
        userMap.set(userID, row)
      });
    }
    data = data.map(item => {
      const { form } = item
      const userInfo = userMap.get(Number(form))
      const { petName, avatarPath } = userInfo
      item.petName = petName
      item.avatarPath = avatarPath
      return item
    })
  }

  req.body = { success: true, message: '获取消息成功', data }
  res.send(req.body)
})

module.exports = router