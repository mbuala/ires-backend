'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Adminsilogiks', {
      idAdminSilogik: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      idUtilisateur: {
        allowNull: false,
        type: Sequelize.INTEGER,
        References: {
          model:'Utilisateur',
          key:'idUtilisateur'
        }
        },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Adminsilogiks');
  }
};