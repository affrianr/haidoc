'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Doctor, { foreignKey : "UserId"})
      User.hasOne(models.Patient, {foreignKey : "UserId"})
    }
  }
  User.init({
    username: {
      type : DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate : {
        notEmpty: {
          msg: `Username is required`
        },
        notNull : {
          msg : `Username is Required`
        },
        isAlphanumeric: {
          msg : `First letter of username must be Alphanumeric only!`
        }
      }
    },
    email : {
      type : DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate : {
        notEmpty : {
          msg : `Email is required`
        },
        notNull: {
          msg : `Email is required`
        },
        isEmail : {
          msg : `Please enter valid email format`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg: `Username is required`
        },
        notNull : {
          msg : `Username is Required`
        },
        min : {
          args: [8],
          msg : `Minimum Password Length should be at least eight characters or more`
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty : {
          msg  : `Role is required`
        },
        notNull : {
          msg : `Role is required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async (user, options)=> {
    console.log(user.password, "==== password")
     
    let hash = bcrypt.hashSync(user.password, 8)
    user.password = hash
  })
  // User.afterCreate(async (user, options)=> {
  //   if(user.role === "Patient"){
  //     await sequelize.models.Patient.create()
  //   } else if( user.role === "Doctor"){
  //     await sequelize.models.Doctor.create()
  //   }
  // })
  return User;
};