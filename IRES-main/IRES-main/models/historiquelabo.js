'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historiquelabo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Historiquelabo.belongsTo(models.Historique,{
        foreignKey:"idHistorique",
        as:"historique"
      })
    }
  };
  Historiquelabo.init({
    idHistoriqueLabo:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    idHistorique: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Historiquelabo',
  });
  return Historiquelabo;
};