'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Doctor);
      Appointment.belongsTo(models.Patient);
    }

    get localDate(){
      return this.appointmentDate.toISOString().slice(0, 10)
    }
  }
  Appointment.init({
    DoctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : `Doctor is required`
        },
        notNull: {
          msg: `Doctor is required`
        }
      }
    },
    PatientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : `Patient is required`
        },
        notNull: {
          msg: `Patient is required`
        }
      }
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : `Date is required`
        },
        notNull: {
          msg: `Date is required`
        },
        isAfter : new Date()
      }
    },
    symptoms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : `Please enter your symptoms`
        },
        notNull: {
          msg: `Please enter your symptoms`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};