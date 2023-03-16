const pool = require('./mysql_init')

module.exports = {
    closersdb: async function (sql) {
    const con = await pool.getConnection()

    try {
      const [rows] = await con.execute(sql) 
      return rows
    } finally {
      con.release()
    }
  },
    pool_exit: function() { pool.end() }
}