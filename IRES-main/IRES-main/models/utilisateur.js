'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //role
      models.Utilisateur.belongsTo(models.Role, {
        foreignKey: "idRole",
        as: "role",
      });

      //session
      models.Utilisateur.hasMany(models.Session,
        {
          foreignKey: 'idUtilisateur',
          as: "user"
        });

      //notification
      models.Utilisateur.hasMany(models.Notification,
        {
          foreignKey: 'idUtilisateur',
          as: "notification"
        });

      //statutUser
      models.Utilisateur.belongsTo(models.StatutUser, {
        foreignKey: "idStatutUtilisateur",
        as: "statut",
      });

      // historique 
      models.Utilisateur.hasMany(models.Historique,
        {
          foreignKey: 'idUtilisateur',
          as: "historique"
        });


      //patient
      models.Utilisateur.hasMany(models.Patient,
        {
          foreignKey: 'idUtilisateur',
          as: "patient"
        },{ onDelete: 'cascade' });



      //medecin
      models.Utilisateur.hasMany(models.Medecin,
        {
          foreignKey: 'idUtilisateur',
          as: "medecin"
        });


      //labo
      models.Utilisateur.hasMany(models.Userlabo,
        {
          foreignKey: 'idUtilisateur',
          as: "labo"
        });

      //labo
      models.Utilisateur.hasMany(models.Adminsilogik,
        {
          foreignKey: 'idUtilisateur',
          as: "adminsilogik"
        });

      models.Utilisateur.hasMany(models.TraitementCRR,
        {
          foreignKey: 'idUtilisateur',
          as: "traitement"
        });

        models.Utilisateur.hasMany(models.Reclamation, 
          {
            foreignKey :'idUtilisateur',
            as : "reclamation"}); 

    }
  };
  Utilisateur.init({
    idUtilisateur: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false

    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    nomComplet : DataTypes.STRING,
    sexe: DataTypes.STRING,
    ville : DataTypes.STRING,
    dateNaissance: DataTypes.DATEONLY,
    telephone: DataTypes.STRING,
    identifiant: DataTypes.STRING,
    email: DataTypes.STRING,
    motDePasse: DataTypes.STRING,
    adresse: DataTypes.STRING,
    etatCivil: DataTypes.STRING,
    cin: DataTypes.STRING,
    photo: DataTypes.STRING,
    isConnected:
    {
      type: DataTypes.BOOLEAN,
      defaultValue: false

    }
    ,
    isLock:
    {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
    ,

    idRole: DataTypes.INTEGER,
    idStatutUtilisateur: {

      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: true

    },
    resettoken: {
      type: DataTypes.STRING,
      allowNull: true,
    },



  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  return Utilisateur;
};