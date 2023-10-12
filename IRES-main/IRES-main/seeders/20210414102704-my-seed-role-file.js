'use strict';
const Role=require('../models').Role;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles',[
      {
      role:'adminSilogik',
      description:'Super Admin',
      createdAt : new Date(),
      updatedAt : new Date(),
      },{
        role:'labo',
        description:'Administrateur',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        role:'userLabo',
        description:'Utilisateur',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        role:'patient',
        description:'Patient',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        role:'medecin',
        description:'Medecin',
        createdAt : new Date(),
        updatedAt : new Date(),
      }



  ])
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
