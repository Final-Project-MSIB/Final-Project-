'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      TransactionHistories.belongsTo(models.Product, { foreignKey: 'ProductId' })
      TransactionHistories.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  TransactionHistories.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "quantity cant be empty"
        },
        isInt: {
          args: true,
          msg: "quantity must be an integer "
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "total_price cant be empty"
        },
        isInt: {
          args: true,
          msg: "total_price must be an integer "
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TransactionHistories',
  });
  return TransactionHistories;
};