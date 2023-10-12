'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activite.hasMany(models.Historique,{
        foreignKey:'idActivite',
        
        as:"historique"
      });
      
    }
  };
  Activite.init({
    idActivite:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    nomActivite: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Activite',
  });
  return Activite;
};