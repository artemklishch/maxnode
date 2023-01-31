const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "nodecomplete",
  password: "Klishch_mysql_1",
  // waitForConnections: true,
  // connectionLimit: 10,
  // maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  // idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  // queueLimit: 0
});

module.exports = pool.promise();
