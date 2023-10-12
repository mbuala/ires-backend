'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Permissions', {
      idPermission: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      permission: {
        type: Sequelize.BOOLEAN
      },
      datePermission: {
        type: Sequelize.DATE
      },
      idPatient: {
        allowNull: false,
        type: Sequelize.INTEGER,
        References: {
          model:'Patient',
          key:'idPatient'
        }
        },
        idMedecin: {
          allowNull: true,
          type: Sequelize.INTEGER,
          References: {
            model:'Medecin',
            key:'idMedecin'
          }
          },
          idCRR: {
            allowNull: true,
            type: Sequelize.INTEGER,
            References: {
              model:'CompteRendu',
              key:'idCRR'
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
    await queryInterface.dropTable('Permissions');
  }
};