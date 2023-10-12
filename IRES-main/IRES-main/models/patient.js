'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    
      models.Patient.belongsTo(models.Utilisateur, {
        foreignKey: "idUtilisateur",
        as:"user",
      },{ onDelete: 'cascade' });

     


          models.Patient.hasMany(models.Permission, 
            {
              foreignKey :'idPatient',
              as : "permission"});

    }
  };
  Patient.init({
    idPatient:  {
      autoIncrement:true,
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false
    
    },
    ipp: DataTypes.STRING,
    idUtilisateur: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Patient',
  });
  Patient.removeAttribute('id');
  return Patient;
};