'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('StatutUsers', [
      {
     
      statut: true,
      
      createdAt : new Date(),
      updatedAt : new Date(),
      
      },
      {
     
        statut: false,
      
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
