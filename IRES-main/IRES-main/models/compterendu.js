'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompteRendu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.CompteRendu.hasMany(models.Permission, 
        {
          foreignKey :'idCRR',
          as : "permission"});

          models.CompteRendu.hasMany(models.TraitementCRR, 
            {
              foreignKey :'idCRR',
              as : "traitement"});
        }
    


    
  };
  CompteRendu.init({
    idCRR:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    path: DataTypes.STRING,
    etatCRR: DataTypes.BOOLEAN,
    dateCreation: DataTypes.DATEONLY,
    biologisteValideur: DataTypes.STRING,
    statutCRRPatient: {type:DataTypes.BOOLEAN, defaultValue:false},
    statutCRRMedecin: {type:DataTypes.BOOLEAN, defaultValue:false},
    nbrPage: DataTypes.INTEGER,
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    numDossier: {
      type: DataTypes.STRING,
      allowNull:false,
       
    },
  }, {
    sequelize,
    modelName: 'CompteRendu',
  });
  return CompteRendu;
};