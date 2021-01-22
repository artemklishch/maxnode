const Sequelize = require('sequelize')

const sequelize = new Sequelize("node-complete", "root", "klishch_mysql_1", {
  host: "localhost",
  dialect: 'mysql'
})
module.exports = sequelize;
