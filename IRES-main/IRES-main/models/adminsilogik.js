'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Adminsilogik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Adminsilogik.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      });
    }
  };
  Adminsilogik.init({
    idAdminSilogik:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    idUtilisateur: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Adminsilogik',
  });
  return Adminsilogik;
};