const { DataTypes } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define(
    "user",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING(33),
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(66),
        validate: {
          isEmail: true,
        },
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_login: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    },
    {
      freezeTableName: true,
    }
  );
  return User;
};
