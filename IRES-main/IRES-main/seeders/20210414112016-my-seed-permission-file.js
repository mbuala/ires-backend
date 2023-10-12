'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Permissions', [
      {
        permission: false,
        idPatient : 1,
        idMedecin: 4,
        idCRR : 5,
        createdAt : new Date(),
        updatedAt : new Date(),
        
        },
        {
          permission: true,
          idPatient : 1,
          idMedecin: 4,
          idCRR : 4,
          createdAt : new Date(),
          updatedAt : new Date(),
          
          },
        {
          permission: true,
          idPatient : 5,
          idMedecin: 4,
          idCRR : 6,
          createdAt : new Date(),
          updatedAt : new Date(),
          
          },
        {
      
        permission: false,
        idPatient : 2,
        idMedecin: 2,
        idCRR : 7,
        createdAt : new Date(),
        updatedAt : new Date(),
        
        },
       { permission: true,
        idPatient : 2,
        idMedecin: 2,
        idCRR : 8,
        createdAt : new Date(),
        updatedAt : new Date(),
        
        },
        { permission: true,
          idPatient : 2,
          idMedecin: 2,
          idCRR : 9,
          createdAt : new Date(),
          updatedAt : new Date(),
          
          },
          { permission: true,
            idPatient : 2,
            idMedecin: 2,
            idCRR : 10,
            createdAt : new Date(),
            updatedAt : new Date(),
            
            },
            { permission: true,
              idPatient : 3,
              idMedecin: 2,
              idCRR : 11,
              createdAt : new Date(),
              updatedAt : new Date(),
              
              },
              { permission: true,
                idPatient : 3,
                idMedecin: 3,
                idCRR : 12,
                createdAt : new Date(),
                updatedAt : new Date(),
                
                },
                { permission: true,
                  idPatient : 3,
                  idMedecin: 3,
                  idCRR : 14,
                  createdAt : new Date(),
                  updatedAt : new Date(),
                  
                  },
                  
                    { permission: true,
                      idPatient : 4,
                      idMedecin: 2,
                      idCRR : 13,
                      createdAt : new Date(),
                      updatedAt : new Date(),
                      
                      },
                      { permission: true,
                        idPatient : 4,
                        idMedecin: 2,
                        idCRR : 3,
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        
                        },
                        { permission: true,
                          idPatient : 4,
                          idMedecin: 2,
                          idCRR : 2,
                          createdAt : new Date(),
                          updatedAt : new Date(),
                          
                          },
                          { permission: true,
                            idPatient : 4,
                            idMedecin: 2,
                            idCRR : 1,
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
