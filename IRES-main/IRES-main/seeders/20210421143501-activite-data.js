'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Activites', [
      {
      
      nomActivite: 'création', 
      
      
      createdAt : new Date(),
      updatedAt : new Date(),
      
      },
      {
      
        nomActivite: 'consultation', 
        
        
        createdAt : new Date(),
        updatedAt : new Date(),
        
        },
        {
      
          nomActivite: 'modification', 
          
          
          createdAt : new Date(),
          updatedAt : new Date(),
          
          },
          {
      
            nomActivite: 'suppression', 
            
            
            createdAt : new Date(),
            updatedAt : new Date(),
            
            },
            {
      
              nomActivite: 'blocage', 
              
              
              createdAt : new Date(),
              updatedAt : new Date(),
              
              },
              {
      
                nomActivite: 'déblocage', 
                
                
                createdAt : new Date(),
                updatedAt : new Date(),
                
              },{
      
                nomActivite: 'permission', 
                
                
                createdAt : new Date(),
                updatedAt : new Date(),
                
              },
              {
      
                nomActivite: 'connexion', 
                
                
                createdAt : new Date(),
                updatedAt : new Date(),
                
              }
     
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
