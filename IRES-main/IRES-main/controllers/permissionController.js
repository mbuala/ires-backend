const Patient = require('../models').Patient;
const Medecin = require('../models').Medecin;
const CCR = require('../models').CompteRendu;
const Permission = require('../models').Permission;
const Notification = require('../models').Notification;
const Historique = require('../models').Historique;
const User = require('../models').Utilisateur;
const Activite =require('../models').Activite;
const HistoriquePatient=require('../models').HistoriquePatient;
const num = require('./functionnality');
const socket = require('../app');

module.exports = {
    bloquerMedecin(req, res) {
        try {

        } catch (error) {
            console.log(error)
        }

    },
    debloquerMedecin(req, res) {

    },
    /*
        LE PATIENT ACCORD LA PERMISSION AU 
        MEDECIN X DE CONSULTER 
        LE COMPTE RENDU Y
    */
        accordpermissionMedecin(req, res) {
            try {
                const
                    idMedecin = req.body.idMedecin,
                    idPatient = req.body.idPatient,
                    idCRR = req.body.idCRR,
                    permission = req.body.permission;
                console.log(req.body)
                if (permission == 'true' || permission == 'false') {
                    Permission.findOne({
                        where: {
                            idPatient: idPatient,
                            idMedecin: idMedecin,
                            idCRR: idCRR
                        }
                    }).then(data => {
                        if (data) {
                            data.update({
                                permission: permission,
                                datePermission: new Date()
                            }).then(() =>
                                //  res.status(200).json({ message: 'update success', data: data });
                                Patient.findOne({
                                    where: {
                                        idPatient: data.idPatient
                                    }, include: [{
                                        model: User,
                                        as: 'user'
                                    }],
                                }).then(patient => {
    
                                    Medecin.findOne({
                                        where: {
                                            idMedecin: data.idMedecin
                                        }, include: [{
                                            model: User,
                                            as: 'user'
                                        }],
                                    }).then(medecin => {
    
                                        if (data.permission == true) {
                                            console.log('vous avez accorder la permission à votre medecin prescripteur de visualiser ce compte rendu')
    
                                            console.log('============medecin', medecin.user.idUtilisateur)
                                            console.log('============patient ', patient.user.idUtilisateur)
                                            //ENVOIE DE LA NOTIFICATION AU PATIENT 
                                            res.status(200).json({ message: 'vous avez accorder la permission a votre medecin prescripteur de visualiser ce compte rendu', data: data, patient: patient, medecin: medecin });
    
                                        } else {
    
                                            console.log('============medecin', medecin.user.idUtilisateur)
                                            console.log('============patient ', patient.user.idUtilisateur)
                                            //ENVOIE DE LA NOTIFICATION AU PATIENT 
                                            console.log('vous avez désaccorder la permission a votre medecin prescripteur de visualiser ce compte rendu')
                                            res.status(200).json({ message: 'vous avez désaccorder la permission a votre medecin prescripteur de visualiser ce compte rendu', data: data, patient: patient, medecin: medecin });
    
                                        }
                                    })
    
                                })
                            )
                        } else {
                            res.status(500).send("Fail! Data Not Found");
                        }
                    }).catch(err => {
                        res.status(500).send("Fail! Error -> " + err);
                    })
                } else {
                    res.status(500).json({ message: 'erreur :type de la permission n\'existe pas', permission })
                }
            } catch (error) {
    
            }
        },

    /*
        A LA CREATION DU PATIENT ON 
        ACCORD LA PERMISSION AU 
        MEDECIN X DE CONSULTER 
        LE COMPTE RENDU Y DU PATIENT Z
    */
    creationPermissionMedecin(req, res) {

    },
    accordpermissionMedecinLaboV1(req,res){
       
        const idmedecin = req.body.idMedecin,
        idpatient = req.body.idPatient;
        
        Permission.create({
            permission: true,
            datePermission: new Date(),
            idPatient:idpatient,
            idMedecin:idmedecin
        }).then(permission=>{
           if(permission){
             Patient.findOne({
                 where:{
                     idPatient:idpatient
                 },
                 include: [{
                    model: User,
                    as: 'user'
                }],
             }).then(patient=>{
                 Medecin.findOne({
                     where:{
                         idMedecin:idmedecin
                     },include:[
                        { model:User,as:'user'}
                     ]
                 }).then(medecin=>{
                    Notification.create({
                        typeNotification:'ajout medecin',description:'le labo a ajouté le medecin : '+medecin.user.nom+' comme medecin  prescripteur',
                        dateNotification:new Date(),
                        status:false,
                        idUtilisateur:patient.idUtilisateur
                    }
                    
                    
                    ).then(notif=>{
                        Notification.create({
                            typeNotification:'ajout patient',description:'le labo a ajouté le patient : '+patient.user.nom+' comme patient',
                            dateNotification:new Date(),
                            status:false,
                            idUtilisateur:medecin.idUtilisateur
                        })
                        var notification = {
                            typeNotification : 'ajout patient',
                            description : 'le labo a ajouté le patient : '+patient.user.nom+' comme patient',
                            dateNotification : new Date(),
                            id : patient.user.identifiant
                        };
                       
                      
                       
                        socket.ioObject.emit("my broadcast", notification);
                        return res.status(200).json({notif})
                    })
                 })
             })
           }
        })


               
           
          
     },
    

     accordpermissionMedecinLabo(req,res){
       
        const idmedecin = req.body.idMedecin,
        idpatient = req.body.idPatient;
        
        Permission.create({
            permission: true,
            datePermission: new Date(),
            idPatient:idpatient,
            idMedecin:idmedecin
        }).then(permission=>{
           if(permission){
             Patient.findOne({
                 where:{
                     idPatient:idpatient
                 },
                 include: [{
                    model: User,
                    as: 'user'
                }],
             }).then(patient=>{
                 Medecin.findOne({
                     where:{
                         idMedecin:idmedecin
                     },include:[
                        { model:User,as:'user'}
                     ]
                 }).then(medecin=>{
                    Notification.create({
                        typeNotification:'Nouveau médecin',description:' Le médecin  '+medecin.user.nom + ' ' + medecin.user.prenom + ' vous a été attribué ',
                        dateNotification:new Date(),
                        status:false,
                        idUtilisateur:patient.idUtilisateur
                    })
                        Notification.create({
                            typeNotification:'Nouveau patient',description:' Le patient '+patient.user.nom +' ' + patient.user.prenom + ' vous a été attribué ',
                            dateNotification:new Date(),
                            status:false,
                            idUtilisateur:medecin.idUtilisateur
                        })
                        var notification1 = {
                            typeNotification : 'Nouveau patient',
                            description : ' Le patient '+patient.user.nom + ' ' + patient.user.prenom + ' vous a été attribué ',
                            dateNotification : new Date(),
                            identifiant : medecin.user.identifiant
                        };
                        var notification2 = {
                            typeNotification : 'Nouveau médecin',
                            description : ' Le médecin  '+medecin.user.nom + ' ' + medecin.user.prenom + ' vous a été attribué ',
                            dateNotification : new Date(),
                            identifiant : patient.user.identifiant
                        };
                      
                       
                        socket.ioObject.emit("notifficationMedecin", notification1);
                        socket.ioObject.emit("notificationPatient", notification2);
                        return res.status(200).json({message :"Medecin Ajouté"})
                    
                 })
             })
           }
        })


               
           
          
     },
    


}