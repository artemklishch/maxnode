const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodecomplete", "root", "Klishch_mysql_1", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
