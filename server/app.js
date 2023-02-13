const express = require('express')
const expressWs = require('express-ws')
const bodyParser = require('body-parser')
const path = require('path')

const user = require('./router/user')
const userInfo = require('./router/userInfo')
const deliverAddress = require('./router/deliverAddress')
const peopleObject = require('./router/peopleObject')
const upload = require('./router/upload')
const home = require('./router/home')
const objectDetail = require('./router/objectDetail')
const objectExchange = require('./router/objectExchange')
const chat = require('./router/chat')

const app = express()
expressWs(app)

app.use('/public',express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(user)
app.use(userInfo)
app.use(deliverAddress)
app.use(peopleObject)
app.use(upload)
app.use(home)
app.use(objectDetail)
app.use(objectExchange)
app.use(chat)

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});