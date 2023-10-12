'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historiqueadminsilogik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Historiqueadminsilogik.belongsTo(models.Historique,{
        foreignKey:"idHistorique",
        as:"historique"
      })
    }
  };
  Historiqueadminsilogik.init({
    idHistoriqueAdminSilogik:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    idHistorique: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Historiqueadminsilogik',
  });
  return Historiqueadminsilogik;
};