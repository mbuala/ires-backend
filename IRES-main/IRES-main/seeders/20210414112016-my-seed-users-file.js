'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Utilisateurs', [
      {
        // un admin silogik
      nom: 'Vallee', 
      prenom: 'Stephanie',
      nomComplet : 'Stéphanie Vallee',
      identifiant: 'VS260821100603',
      email:'mbualaj@gmail.com',
      idRole:1,
      motDePasse : bcrypt.hashSync('azerty123', 10),
      isConnected:false,
      isLock:false,
      idStatutUtilisateur : 2,
      createdAt : new Date(),
      updatedAt : new Date(),
      
      },
      {
        // userLabo
        nom: 'Olivie', 
        prenom: 'Michel',
        nomComplet : 'Olivie Michel',
        identifiant: 'OM260821100627',
        email:'test3@gmail.com',
        idRole:3,
        motDePasse : bcrypt.hashSync('azerty123', 10),
        isConnected:false,
        isLock:false,
        idStatutUtilisateur : 2,
        createdAt : new Date(),
        updatedAt: new Date()
        },
        {
          //medecin
          nom: 'Pichon', 
          prenom: 'Juliette',
          nomComplet : 'Juliette Pichon',
          identifiant: 'PJ260821100715',
          email:'test1@gmail.com',
          idRole:5,
          motDePasse : bcrypt.hashSync('azerty123', 10),
          isConnected:false,
          isLock:false,
          idStatutUtilisateur : 2,
          createdAt : new Date(),
          updatedAt: new Date()
          },
          {
            //patient
            nom: 'Simone', 
            prenom: 'Chauvin',
            nomComplet : 'Simone Chauvin',
            identifiant: 'SC260821100618',
            email:'test2@gmail.com',
            idRole:4,
            motDePasse : bcrypt.hashSync('azerty123', 10),
            isConnected:false,
            isLock:false,
            idStatutUtilisateur : 2,
            createdAt : new Date(),
            updatedAt: new Date()
            },
            {
              // admin labo
              nom: 'William', 
              prenom: 'Poulain',
              nomComplet : 'William Poulain',
              identifiant: 'WP260821100815',
              email:'test22@gmail.com',
              idRole:2,
              motDePasse : bcrypt.hashSync('azerty123', 10),
              isConnected:false,
              isLock:false,
              idStatutUtilisateur : 2,
              createdAt : new Date(),
              updatedAt: new Date()
              },
              {
                //patient 2 
                nom: 'Pelletier', 
                prenom: 'Thibault',
                nomComplet : 'Thibault Pelletier',
                identifiant: 'PT260821100901',
                email:'boutouilabrare56@gmail.com',
                idRole:4,
                motDePasse : bcrypt.hashSync('azerty123', 10),
                isConnected:false,
                isLock:false,
                idStatutUtilisateur : 2,
                createdAt : new Date(),
                updatedAt: new Date()
                },
                {
                  // medecin
                  nom: 'Roche', 
                  prenom: 'Raymond',
                  nomComplet : 'Raymond Roche',
                  identifiant: 'RR260821100817',
                  email:'test3@gmail.com',
                  idRole:5,
                  motDePasse : bcrypt.hashSync('azerty123', 10),
                  isConnected:false,
                  isLock:false,
                  idStatutUtilisateur : 2,
                  createdAt : new Date(),
                  updatedAt: new Date()
                  },
                  {
                    // medecin 3
                    nom: 'Guyot', 
                    prenom: 'Adrien',
                    nomComplet : 'Adrien Guyot',
                    identifiant: 'GA260821100918',
                    email:'test3@gmail.com',
                    idRole:5,
                    motDePasse : bcrypt.hashSync('azerty123', 10),
                    isConnected:false,
                    isLock:false,
                    idStatutUtilisateur : 2,
                    createdAt : new Date(),
                    updatedAt: new Date()
                    },
                    {
                      // medecin 4
                      nom: 'Gomes', 
                      prenom: 'Augustin',
                      nomComplet : 'Augustin Gomes',
                      identifiant: 'GA260821101045',
                      email:'test3@gmail.com',
                      idRole:5,
                      motDePasse : bcrypt.hashSync('azerty123', 10),
                      isConnected:false,
                      isLock:false,
                      idStatutUtilisateur : 2,
                      createdAt : new Date(),
                      updatedAt: new Date()
                      },
                       //patient 3
                      {nom: 'Schmitt', 
                      prenom: 'Audrey',
                      nomComplet : 'Audrey Schmitt',
                      identifiant: 'SA260821101103',
                      email:'jonathan@gmail.com',
                      idRole:4,
                      motDePasse : bcrypt.hashSync('azerty123', 10),
                      isConnected:false,
                      isLock:false,
                      idStatutUtilisateur : 2,
                      createdAt : new Date(),
                      updatedAt: new Date()
                      },
                      //patient
                      {nom: 'Remy', 
                      prenom: 'Claire',
                      nomComplet : 'Claire Remy',
                      identifiant: 'RC260821101208',
                      email:'lince@gmail.com',
                      idRole:4,
                      motDePasse : bcrypt.hashSync('azerty123', 10),
                      isConnected:false,
                      isLock:false,
                      idStatutUtilisateur : 2,
                      createdAt : new Date(),
                      updatedAt: new Date()
                      },
                      //patient
                      {nom: 'Gilbert', 
                      prenom: 'William',
                      nomComplet : 'William Gilbert',
                      identifiant: 'GW260821101309',
                      email:'yambo@gmail.com',
                      idRole:4,
                      motDePasse : bcrypt.hashSync('azerty123', 10),
                      isConnected:false,
                      isLock:false,
                      idStatutUtilisateur : 2,
                      createdAt : new Date(),
                      updatedAt: new Date()
                      },

                      
     
     
    ], {});

    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
