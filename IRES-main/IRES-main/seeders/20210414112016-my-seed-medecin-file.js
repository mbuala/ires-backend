'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Medecins', [
      {
       specialite :'tgggg',
        idUtilisateur:3,
      createdAt : new Date(),
      updatedAt : new Date(),
      
      },
      {
        specialite :'card',
         idUtilisateur:7,
       createdAt : new Date(),
       updatedAt : new Date(),
       
       },
       {
        specialite :'lolz',
         idUtilisateur:8,
       createdAt : new Date(),
       updatedAt : new Date(),
       
       },
       {
        specialite :'cardmzlz',
         idUtilisateur:9,
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
