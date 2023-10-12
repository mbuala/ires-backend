const CCR = require('../models').CompteRendu;
const Permission = require('../models').Permission;
const Patient = require('../models').Patient;
const User = require('../models').Utilisateur;
const Medecin = require('../models').Medecin;
const socket = require('../app');
const Notification = require('../models').Notification;
module.exports = {
    Notification(Notifications) {
      
       
        let notif = JSON.parse(Notifications[0])
        let idCRR = notif.idCRR
        let numDossier = notif.numDossier
        
      
        console.log(idCRR)
        Permission.findOne({
            where : {
                    idCRR : idCRR
                    },
            include : [
                        {
                            model: Patient,
                            as: 'patient',
                            include:[
                                        {
                                            model : User,
                                            as : 'user',
                                        }
                                    ]
                        },
                        {
                            model: Medecin,
                            as: 'medecin',
                            include:[
                                {
                                    model : User,
                                    as : 'user',
                                }
                            ]
                        }
                      ]
        })
        .then(Permission =>{
            // let permission = JSON.parse(Permission)
           
            let iduserPatient = Permission.patient.idUtilisateur
            let iduserMedecin = Permission.medecin.idUtilisateur
         
            Notification.create({
                typeNotification:'Nouveau compte rendu',description:'Le compte rendu : '+ numDossier +'est disponible.',
                dateNotification:new Date(),
                status:false,
                idUtilisateur:iduserPatient
            }).then(notif => {
                Notification.create({
                    typeNotification:'Nouveau compte rendu',description:'Le compte rendu : '+ numDossier +'est disponible.',
                    dateNotification:new Date(),
                    status:false,
                    idUtilisateur:iduserMedecin
                })
            })
           
            socket.ioObject.emit("CompteRendu", Permission);
        })
        .catch(err => { console.log(err) });
     
     
   
     
    },
}