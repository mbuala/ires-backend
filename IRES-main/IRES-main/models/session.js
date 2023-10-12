'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
      models.Session.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"Session",
      });


    }
  };
  Session.init({
    idSession:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE,
    statut: DataTypes.BOOLEAN,
    idUtilisateur: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};