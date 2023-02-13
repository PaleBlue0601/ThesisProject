const multerConfig = require('./multerConfig')

const fileName = 'file'

function upload(req, res) {
  return new Promise((resolve, reject) => {
    multerConfig.single(fileName)(req, res, err => {
      if(err) {
        console.log(err);
        reject('')
      } else {
        resolve(req.file.filename)
      }
    })
  })
}

module.exports = upload