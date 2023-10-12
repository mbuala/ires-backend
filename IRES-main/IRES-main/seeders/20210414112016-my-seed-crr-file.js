'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('CompteRendus', [
      {
     
      path:'https://www.biopoleantilles.fr/wp-content/uploads/2019/04/O_RES_ENR_01_DELAIS_DE_RENDU-v13.pdf',
      biologisteValideur :'ggggg',
      numDossier:'4567895',
      statutCRRPatient : false,
      statutCRRMedecin : false,
      dateCreation : '2021-05-13',
      createdAt : new Date(),
      updatedAt : new Date(),
      
      },
      {
     
        path:'https://covid.genbio.fr/wp-content/uploads/2021/03/sero-post-vaccinale-covid-fiche-de-demande-1.pdf',
        biologisteValideur :'kkkkkk',
        numDossier:'4567895',
        statutCRRPatient : false,
        statutCRRMedecin : false,
        dateCreation : '2021-04-10',
        createdAt : new Date(),
        updatedAt : new Date(),
        
        },
        {
     
          path:'http://germignyleveque.fr/wp-content/uploads/2020/07/Compte-rendu-du-conseil-municipal-du-30-juin-2020.pdf',
          biologisteValideur :'mmmmmm',
          numDossier:'7383739',
          statutCRRPatient : false,
          statutCRRMedecin : false,
          dateCreation : '2021-03-22',
          createdAt : new Date(),
          updatedAt : new Date(),
          
          },
          {
     
            path:'https://covid.genbio.fr/wp-content/uploads/2021/03/sero-post-vaccinale-covid-fiche-de-demande-1.pdf',
            biologisteValideur :'lllll',
            numDossier:'987737',
            statutCRRPatient : false,
            statutCRRMedecin : false,
            dateCreation : '2021-02-25',
            createdAt : new Date(),
            updatedAt : new Date(),
            
            },
            {
     
              path:'http://germignyleveque.fr/wp-content/uploads/2020/01/Compte-rendu-du-conseil-municipal-du-23-JANVIER-2020.pdf',
              biologisteValideur :'lllll',
              numDossier:'123456',
              statutCRRPatient : false,
              statutCRRMedecin : false,
              dateCreation : '2021-05-19',
              createdAt : new Date(),
              updatedAt : new Date(),
              
              },
              {
     
                path:'https://covid.genbio.fr/wp-content/uploads/2021/03/sero-post-vaccinale-covid-fiche-de-demande-1.pdf',
                biologisteValideur :'lllll',
                numDossier:'123456',
                statutCRRPatient : false,
                statutCRRMedecin : false,
                dateCreation : '2021-05-23',
                createdAt : new Date(),
                updatedAt : new Date(),
                
                },
                {
     
                  path:'https://www.vd.ch/fileadmin/user_upload/themes/mobilite/automobile/fichiers_pdf/formul/8_2_F_1226_Resultat_examen_medical.pdf',
                  biologisteValideur :'cfddd',
                  numDossier:'938364',
                  statutCRRPatient : false,
                  statutCRRMedecin : false,
                  dateCreation : '2021-05-23',
                  createdAt : new Date(),
                  updatedAt : new Date(),
                  
                  }, {
     
      path:'https://www.biopoleantilles.fr/wp-content/uploads/2019/04/O_RES_ENR_01_DELAIS_DE_RENDU-v13.pdf',
     
                    biologisteValideur :'llll',
                    numDossier:'9ma2021',
                    statutCRRPatient : true,
                    statutCRRMedecin : false,
                    dateCreation : new Date(),
                    createdAt : new Date(),
                    updatedAt : new Date(),
                    
                    },
                    {
     
                      path:'https://covid.genbio.fr/wp-content/uploads/2021/03/sero-post-vaccinale-covid-fiche-de-demande-1.pdf',
                      biologisteValideur :'lomama',
                      numDossier:'4578tre',
                      statutCRRPatient : true,
                      statutCRRMedecin : false,
                      dateCreation : '2021-05-23',
                      createdAt : new Date(),
                      updatedAt : new Date(),
                      
                      },
                      {
     
                        path:'http://germignyleveque.fr/wp-content/uploads/2020/07/Compte-rendu-du-conseil-municipal-du-30-juin-2020.pdf',
                        biologisteValideur :'lobrandy',
                        numDossier:'938364',
                        statutCRRPatient : true,
                        statutCRRMedecin : false,
                        dateCreation : new Date(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        
                        },
                        {path:'http://laboratoire-biosmose.fr/liste-analyses.pdf',
                        biologisteValideur :'lomama',
                        numDossier:'95622',
                        statutCRRPatient : true,
                        statutCRRMedecin : false,
                        dateCreation : new Date(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        
                        },
                        {path:'http://svt.spip.ac-rouen.fr/IMG/pdf/couple_y.pdf',
                        biologisteValideur :'dimer',
                        numDossier:'855225',
                        statutCRRPatient : true,
                        statutCRRMedecin : false,
                        dateCreation : new Date(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        
                        },
                        {path:'http://www.ifsidijon.info/v2/wp-content/uploads/2017/12/Examens-de-biologie-m%C3%A9dicale.pdf',
                        biologisteValideur :'sidibe',
                        numDossier:'255825',
                        statutCRRPatient : true,
                        statutCRRMedecin : false,
                        dateCreation : new Date(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        
                        },
                        {path:'http://www.hcerdanya.eu/sites/default/files/media/media/Documents/Publicacions/laboratoire_catalogue_des_examens.pdf',
                        biologisteValideur :'kakimi',
                        numDossier:'2258266',
                        statutCRRPatient : true,
                        statutCRRMedecin : false,
                        dateCreation : new Date(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        
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
