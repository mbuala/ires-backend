'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Historiques', {
      idHistorique: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idActivite:{
        type: Sequelize.INTEGER,
        allowNull:false,
        References: {
          model:'Activite',
          key:'idActivite'
        }
      },
      dateHistorique: {
        type: Sequelize.DATEONLY,
        allowNull: true
      
      },
      idUtilisateur: {
        allowNull: false,
        type: Sequelize.INTEGER,
        References: {
          model:'Utilisateur',
          key:'idUtilisateur'
        }
        },
        message: {
          type: Sequelize.STRING,
          allowNull: true
        
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
    await queryInterface.dropTable('Historiques');
  }
};