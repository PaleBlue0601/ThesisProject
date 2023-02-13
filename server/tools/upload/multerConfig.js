const multer = require('multer')
const md5 = require('md5')

const path = require('path')
const resolve = dir => {
  return path.join(__dirname, './', dir)
}

let storage = multer.diskStorage({
  //存储路径
  destination: (req, file, cb) => {
    cb(null, resolve(`../../public/images`))
  },
  filename: (req, file, cb) => {
    let fileFormat = (file.originalname).split(".");
    cb(null, md5(+new Date()) + "." + fileFormat[fileFormat.length - 1]);
  }
})

const multerConfig = multer({
  storage
});

module.exports = multerConfig