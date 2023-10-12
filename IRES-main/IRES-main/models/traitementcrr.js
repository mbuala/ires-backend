'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TraitementCRR extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // users
      models.TraitementCRR.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      });
      // type traitement

      models.TraitementCRR.belongsTo(models.TypeDeTraitement, {
        foreignKey: "idTypeTraitement",
        as:"typetraitement",
      });
      // compre rendu 
      models.TraitementCRR.belongsTo(models.CompteRendu, {
        foreignKey: "idCRR",
        as:"compterendu",
      });
    }
  };
  TraitementCRR.init({
    idTraitementCrr :{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    dateTraitementCRR: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'TraitementCRR',
  });
  return TraitementCRR;
};