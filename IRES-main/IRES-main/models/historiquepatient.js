'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historiquepatient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Historiquepatient.belongsTo(models.Historique,{
        foreignKey:"idHistorique",
        as:"historique"
      })

    }
  };
  Historiquepatient.init({
    idHistoriquePatient:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    idHistorique: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Historiquepatient',

  });
  return Historiquepatient;
};