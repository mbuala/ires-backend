'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Adminlabos', [
      {
     
        idUtilisateur:5,
      createdAt : new Date(),
      updatedAt : new Date(),
      
      },
      
     
     
    ], {});

    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
