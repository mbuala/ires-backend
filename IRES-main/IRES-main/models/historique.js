'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historique extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      models.Historique.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"historique",
      });
      Historique.belongsTo(models.Activite,{
        foreignKey:"idActivite",
        as:"activite"
      })
      Historique.hasMany(models.Historiquepatient,{
        foreignKey:"idHistorique",
        as:"Historiquepatient"
      })
      Historique.hasMany(models.Historiquelabo,{
        foreignKey:"idHistorique",
        as:"Historiquelabo"
      })
      Historique.hasMany(models.Historiqueadminsilogik,{
        foreignKey:"idHistorique",
        as:"Historiqueadminsilogik"
      })
      Historique.hasMany(models.Historiquemedecin,{
        foreignKey:"idHistorique",
        as:"Historiquemedecin"
      })

    }
  };
  Historique.init({
    idHistorique:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    dateHistorique :DataTypes.DATEONLY,
    idUtilisateur: DataTypes.INTEGER,
    idActivite:DataTypes.INTEGER,
    message:DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Historique',
  });
  return Historique;
};