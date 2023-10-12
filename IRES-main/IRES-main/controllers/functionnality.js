const Role = require('../models').Role;
const Historique = require('../models').Historique;
const User = require('../models').Utilisateur;
const Activite =require('../models').Activite;
var dateFormat = require('dateformat');


exports.getIdentifiant = (nom) => {
    var day2=dateFormat(new Date(), "ddmmyyHHmmss");

    const day = new Date();
    var num = Math.floor((Math.random() * 1000000));
    const numdossier =nom+day2;
    return numdossier;

};
exports.setHistorique=(_idUtilisateur,_activite,_message)=>{
   console.log(_activite,_idUtilisateur)
    Activite.findOne({
        where:{
            nomActivite:_activite
        }
    }).then(acttivite=>{
        Historique.create({
        dateHistorique:new Date(),
        idUtilisateur:_idUtilisateur,
        idActivite:acttivite.idActivite,
        message:_message,      
        }).then(historique=>{
            return historique;
        })
    })
    
}

