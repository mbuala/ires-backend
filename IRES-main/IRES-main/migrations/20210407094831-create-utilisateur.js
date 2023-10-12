'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Utilisateurs', {
      idUtilisateur: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        allowNull: true,
        type: Sequelize.STRING
      },
      prenom: {
        allowNull: true,
        type: Sequelize.STRING
      },
      nomComplet: {
        allowNull: true,
        type: Sequelize.STRING
      },
      sexe: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ville : {
        allowNull: true,
        type: Sequelize.STRING
      },
      dateNaissance: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      telephone: {
        allowNull: true,
        type: Sequelize.STRING
      },
      identifiant: {
        
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      motDePasse: {
        type: Sequelize.STRING
      },
      adresse: {
        allowNull: true,
        type: Sequelize.STRING
      },
      etatCivil: {
        allowNull: true,
        type: Sequelize.STRING
      },
      cin: {
        allowNull: true,
        type: Sequelize.STRING
      },
      photo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isConnected: {
        type: Sequelize.BOOLEAN,
        default:false,
      },
      idRole: {
        allowNull: false,
        type: Sequelize.INTEGER,
        References: {
          model:'Role',
          key:'idRole'
        }
        },
        isLock :{
          type: Sequelize.BOOLEAN,
          default :false,
        },
        resettoken:{
          type:Sequelize.STRING,
          allowNull:true,
        },
        idStatutUtilisateur: {
          allowNull: true,
          type: Sequelize.INTEGER,
          default:false,
          References: {
            model:'StatutUser',
            key:'idStatutUtilisateur',
            
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
    await queryInterface.dropTable('Utilisateurs');
  }
};