'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'CategoryId' });
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title cannot be empty"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Price cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Price must be an integer"
        },
        max: {
          args: 50000000,
          msg: "Price must be less than 50000000"
        },
        min: {
          args: 1,
          msg: "Price must be greater than 0"
        }

      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Stock cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Stock must be an integer"
        },
        min: {
          args: 5,
          msg: "Stock must be greater than 5"
        }
      }
    },
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',

  });
  return Product;
};