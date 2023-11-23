'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.belongsTo(models.User, { foreignKey: "UserId" })
      Patient.belongsToMany(models.Doctor, {through: models.Appointment})
    }
  }
  Patient.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : `Name is required`
        },
        notNull: {
          msg : `Name is required`
        }
      }
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : `Phone number is required`
        },
        notNull: {
          msg : `Phone number is required`
        },
        min : {
          args : [10],
          msg : `Minimum Phone Number Length should be at least ten characters or more`
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : `Please input your address`
        },
        notNull: {
          msg : `Please input your address`
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    }
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};