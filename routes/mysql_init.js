const mysql = require('mysql2/promise')

require('dotenv').config()

const config = {
  host: process.env.HITOMIDB_HOST,
  user: process.env.HITOMIDB_USER,
  password: process.env.HITOMIDB_PASSWORD,
  database: process.env.HITOMIDB_DATABASE,
  charset: process.env.HITOMIDB_CHARSET,
  port: process.env.HITOMIDB_PORT
}

const pool = mysql.createPool(config)

module.exports = {
  getConnection: async function () {
    return await pool.getConnection()
  },
  end: function () {
    return pool.end()
  }
}
