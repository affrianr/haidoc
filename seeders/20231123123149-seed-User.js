'use strict';
const data = require('../data/user.json')
const { Helper, hashPass } = require('../helpers/helper')

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
   data.map(el => {
    delete el.id
    el.password = hashPass(el.password)
    el.createdAt = el.updatedAt = new Date()

    return el
   })
   await queryInterface.bulkInsert("Users", data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  }
};
