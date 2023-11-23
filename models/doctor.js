'use strict';
const {
  Model
} = require('sequelize');
const { options } = require('../routes');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.User, { foreignKey: "UserId" });
      Doctor.belongsToMany(models.Patient, { through: models.Appointment });
    }

    get titleName(){
      if(this.gender === "male"){
        return `Mr. ${this.name}`
      }
      if(this.gender === "female"){
        return `Mrs. ${this.name}`
      }
    }

    static showDoctor(){
      return Doctor.findAll()
    }
  }
  Doctor.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg : `Name is required`
        },
        notNull: {
          notNull: {
            msg : `Name is required`
          }
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
        notNull:{
          msg: `Phone number is required`
        },
        min : {
          args : [10],
          msg : `Minimum Phone Number Length should be at least ten characters or more`
        }
      }
    },
    speciality: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty : {
          msg : `Speciality field is required`
        },
        notNull: {
          msg : `Speciality field is required`
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
    profile_picture:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Profile picture is required`
        },
        notNull: {
          msg: `Profile picture is required`
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty : true,
        notNull : true
      }
    }
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  // Doctor.beforeCreate(async (doctor, options)=> {})
  return Doctor;
};