'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../utils/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.TransactionHistories, { foreignKey: 'UserId' });
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Full name cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'email',
        msg: 'Email already exists'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Email cannot be empty"
        },
        isEmail: {
          args: true,
          msg: 'Email must be valid',
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Password cannot be empty"
        },
        len: {
          args: [6, 10],
          msg: "Password must be between 6 and 10 characters"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Gender cannot be empty"
        },
        isIn: {
          args: [['male', 'female']],
          msg: "Gender must be male or female"
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 'customer',
      validate: {
        notEmpty: {
          args: true,
          msg: "Role cannot be empty"
        },
        isIn: {
          args: [['admin', 'customer']],
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notEmpty: {
          args: true,
          msg: "Balance cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Balance must be an integer"
        },
        min: {
          args: [0],
          msg: "Balance must be greater than 0"
        },
        max: {
          args: [100000000],
          msg: "Balance must be less than 100000000"
        }
      },
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      async beforeCreate(user) {
        const hashedPassword = hashPassword(user.password)
        user.password = hashedPassword
        user.balance = 0
      }
    }
  });
  return User;
};