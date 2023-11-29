'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Product, { foreignKey: 'CategoryId' });

    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'type',
        msg: 'Category already exists'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Type cannot be empty"
        },

      }
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Sold product amount cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Sold product amount must be an integer"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    hooks: {
      async beforeCreate(category) {
        category.sold_product_amount = 0
      }
    }
  });
  return Category;
};