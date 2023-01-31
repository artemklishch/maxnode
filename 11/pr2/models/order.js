const { DataTypes } = require("sequelize");
const sequalize = require("../util/database");

const Order = sequalize.define("orders", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
