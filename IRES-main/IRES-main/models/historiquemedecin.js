'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historiquemedecin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Historiquemedecin.belongsTo(models.Historique,{
        foreignKey:"idHistorique",
        as:"historique"
      })
    }
  };
  Historiquemedecin.init({
    idHistoriqueMedecin:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    idHistorique: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Historiquemedecin',
  });
  return Historiquemedecin;
};