'use strict';
module.exports = {
  up: async (queryInterface, DataTypes,Sequelize) => {
    await queryInterface.createTable('CompteRendus', {
      idCRR: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      path: {
        type: DataTypes.STRING
      },
      etatCRR: {
        type: DataTypes.BOOLEAN
      },
      dateCreation: {
        type: DataTypes.DATEONLY,
      },
      biologisteValideur: {
        type: DataTypes.STRING
      },
      statutCRRPatient: {
        type: DataTypes.BOOLEAN,
        default:false,
      },
      statutCRRMedecin: {
        type: DataTypes.BOOLEAN,
        default:false,
      },
      nbrPage: {
        type: DataTypes.INTEGER
      },
      numDossier: {
        type: DataTypes.STRING,
        allowNull:false,
        
         
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
    await queryInterface.sequelize.query("CREATE or replace function public.notify1_event()"+
    "returns trigger"+
   " as $$ "+
   " begin"+
   " perform pg_notify('new_event', row_to_json(New) :: text);"+
   " return null;"+
    "end;"+
   " $$ LANGUAGE plpgsql ")
   await queryInterface.sequelize.query('CREATE trigger test after insert on public."CompteRendus"'
   +' FOR EACH ROW EXECUTE PROCEDURE public.notify1_event()')
  },
  down: async (queryInterface, Sequelize,DataTypes) => {
    await queryInterface.dropTable('CompteRendus');
  }
};