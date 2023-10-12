'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatutUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
      models.StatutUser.hasMany(models.Utilisateur, 
        {
          foreignKey :'idStatutUtilisateur',
          as : "users"});


    }
  };
  StatutUser.init({
    idStatutUtilisateur:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    statut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StatutUser',
  });
  return StatutUser;
};