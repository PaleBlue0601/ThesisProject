const mysql = require('mysql')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // 本地
  password: '1154077274',
  database: 'eopc',
})

db.query('select 1', (err, results) => {
  if (err) return console.log(err)
  console.log('mysql connect sucess!');
})

db.find = (table, data = {}) => {
  let sql = `SELECT * FROM ${table} WHERE ?`
  return new Promise((reslove, reject) => {
    db.query(sql, data, (err, rows) => {
      if (err) reject({ msg: '查询失败！', err: err })
      reslove(rows)
    })
  }).catch(err => {
    console.log(err);
  })
}

db.insert = (table, data = {}) => {
  let sql = `INSERT INTO ${table} SET ?`
  return new Promise((reslove, reject) => {
    db.query(sql, data, (err, rows) => {
      if (err) reject({ msg: '添加失败！', err: err })
      reslove(rows)
    })
  }).catch(err => {
    console.log(err);
  })
}

db.delete = (table, data = {}) => {
  let sql = `DELETE FROM ${table} WHERE ?`
  return new Promise((reslove, reject) => {
    db.query(sql, data, (err, rows) => {
      if (err) reject({ msg: '删除失败！', err: err })
      reslove(rows)
    })
  }).catch(err => {
    console.log(err);
  })
}

db.update = (table, data = {}) => {
  let sql = `UPDATE ${table} SET ? WHERE ?`
  return new Promise((reslove, reject) => {
    db.query(sql, data, (err, rows) => {
      if (err) reject({ msg: '修改失败！', err: err })
      reslove(rows)
    })
  }).catch(err => {
    console.log(err);
  })
}

db.customQuery = (sql, data = {}) => {
  return new Promise((reslove, reject) => {
    db.query(sql, data, (err, rows) => {
      if (err) reject({ msg: '操作失败！', err: err })
      reslove(rows)
    })
  }).catch(err => {
    console.log(err);
  })
}

module.exports = db