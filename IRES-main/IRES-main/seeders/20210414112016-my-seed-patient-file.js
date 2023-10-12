'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Patients', [
      {
       ipp :'tgggg',
        idUtilisateur:4,
      createdAt : new Date(),
      updatedAt : new Date(),
      
      },
      {
        ipp :'jjjjjj',
         idUtilisateur:6,
       createdAt : new Date(),
       updatedAt : new Date(),
       
       },
       {
        ipp :'2021kkk',
         idUtilisateur:10,
       createdAt : new Date(),
       updatedAt : new Date(),
       
       },
       
       {
        ipp :'2021llll',
         idUtilisateur:11,
       createdAt : new Date(),
       updatedAt : new Date(),
       
       },{
        ipp :'2020group',
         idUtilisateur:12,
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
