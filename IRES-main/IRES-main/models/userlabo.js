'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Userlabo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Userlabo.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      });
    }
  };
  Userlabo.init({
    idUserLabo:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    service: DataTypes.STRING,
    idUtilisateur: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Userlabo',
  });
  return Userlabo;
};