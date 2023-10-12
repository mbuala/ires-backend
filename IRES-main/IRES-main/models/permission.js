'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // patient
      models.Permission.belongsTo(models.Patient, 
        {
          foreignKey :'idPatient',
          as : "patient"});
          // medecin 
          models.Permission.belongsTo(models.Medecin, 
        {
          foreignKey :'idMedecin',
          as : "medecin"});
          // crr
          models.Permission.belongsTo(models.CompteRendu, 
            {
              foreignKey :'idCRR',
              as : "compterendu"});
    }
  };
  Permission.init({
    idPermission:{
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    idMedecin:{
    allowNull: true,
    type: DataTypes.INTEGER,
    References: {
      model:'Medecin',
      key:'idMedecin'
    }
    },
    idPatient:{
      allowNull: true,
      type: DataTypes.INTEGER,
      References: {
        model:'Patient',
        key:'idPatient'
      }
    },
    idCRR:{
      allowNull: true,
      type: DataTypes.INTEGER,
      References: {
        model:'Patient',
        key:'idPatient'
      }
    },
    
    
    permission: DataTypes.BOOLEAN,
    datePermission: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};
