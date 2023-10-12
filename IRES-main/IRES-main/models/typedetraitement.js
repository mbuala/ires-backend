'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeDeTraitement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.TypeDeTraitement.hasMany(models.TraitementCRR, 
        {
          foreignKey :'idTraitementCrr',
          as : "traitement"});
    }
  };
  TypeDeTraitement.init({
    idTypeTraitement:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    nomTypeTtm: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TypeDeTraitement',
  });
  return TypeDeTraitement;
};