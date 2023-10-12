'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medecin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Medecin.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      });


     

          models.Medecin.hasMany(models.Permission, 
            {
              foreignKey :'idMedecin',
              as : "permission"});

    }
  };
  Medecin.init({
    idMedecin:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    specialite: DataTypes.STRING,
    idUtilisateur: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Medecin',
  });
  return Medecin;
};