'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TraitementCRRs', {
      idTraitementCrr: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateTraitementCRR: {
        type: Sequelize.DATE
      },
      idCRR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        References: {
          model:'CompteRendu',
          key:'idCRR'
        }
        },

        idUtilisateur: {
          allowNull: false,
          type: Sequelize.INTEGER,
          References: {
            model:'Utilisateur',
            key:'idUtilisateur'
          }
          },
          idTypeTraitement: {
            allowNull: false,
            type: Sequelize.INTEGER,
            References: {
              model:'TypeDeTraitement',
              key:'idTypeTraitement'
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
    await queryInterface.dropTable('TraitementCRRs');
  }
};