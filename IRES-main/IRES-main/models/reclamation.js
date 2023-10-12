'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reclamation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Reclamation.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      });


     

    }
  };
  Reclamation.init({
    idReclamation:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },

    message: DataTypes.TEXT,
    date: DataTypes.DATEONLY,
    idUtilisateur:DataTypes.INTEGER,
   

  }, {
    sequelize,
    modelName: 'Reclamation',
  });
  return Reclamation;
};