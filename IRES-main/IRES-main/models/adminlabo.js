'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Adminlabo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Adminlabo.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      });
    }
  };
  Adminlabo.init({
    idAdminLabo:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    
    idUtilisateur: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Adminlabo',
  });
  return Adminlabo;
};