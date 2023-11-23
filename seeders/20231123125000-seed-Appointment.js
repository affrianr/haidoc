'use strict';

const data = require('../data/appointmentDate.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  //  console.log(data)
  data.map(el => {
    delete el.id

    el.createdAt = el.updatedAt = new Date()

    return el
  })
   await queryInterface.bulkInsert('Appointments', data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Appointments', null, {})
  }
};
