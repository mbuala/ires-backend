'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  
      models.Notification.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      });
    }
  };
  Notification.init({
    idNotification:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    typeNotification: DataTypes.STRING,
    description: DataTypes.STRING,
    dateNotification: DataTypes.DATEONLY,
    status: DataTypes.BOOLEAN,
    idUtilisateur: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};