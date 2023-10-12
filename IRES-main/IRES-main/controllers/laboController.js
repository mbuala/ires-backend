
const User = require('../models').Utilisateur;
const Patient = require('../models').Patient;
const Medecin = require('../models').Medecin;
const Userlabo = require('../models').Userlabo;
const Adminsilogik = require('../models').Adminsilogik;
const Adminlabo = require('../models').Adminlabo;
const Role = require('../models').Role;
const StatutUser = require('../models').StatutUser;
const CompteRendu = require('../models').CompteRendu;
const Sequelize = require('sequelize');
var sequelize = require('sequelize');
const Permission = require('../models').Permission
const Notification = require('../models').Notification;
const Op = Sequelize.Op;
const num = require('./functionnality');
const socket = require('../app');

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: elements } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, elements, totalPages, currentPage };
  };
module.exports = {
    //recuperation des tout les Utilisateur
    
    getAlluser(req, res) {
        console.log(req.method)
        try {
            User.findAll({
                order: [
                    ['createdAt', 'DESC'],
                       
                    ],
                include: [
                    {
                        model: Role,
                        as: 'role'
                    },
                    {
                        model: Medecin,
                        as: 'medecin'
                    },
                    {
                        model: Patient,
                        as: 'patient'
                    },
                    {
                        model: Userlabo,
                        as: 'labo'
                    }

                ]

            }).then(users => {

                return res.status(200).json({ message: 'success all users', users: users })
            }).catch(err => {
                res.status(500).json({ message: 'error data' });
            });
        } catch (error) {

        }


    },
    getUserLabo(req,res){
        const { page, size, numDossier, nomPatient } = req.body;
    var condition = numDossier ? { numDossier: { [Op.like]: `%${numDossier}%` } } : null;
    var con = nomPatient ? {
        [Op.or]: [

            Sequelize.where(

                Sequelize.fn("concat", Sequelize.col("nom"), ' ', Sequelize.col("prenom")), {
                [Op.like]: `%${nomPatient}%`,
            }),


            Sequelize.where(

                Sequelize.fn("concat", Sequelize.col("prenom"), ' ', Sequelize.col("nom")), {
                [Op.like]: `%${nomPatient}%`,
            }),

        ]
    } : null;
    const { limit, offset } = getPagination(page, size);
    Patient.findAndCountAll(
        {

            include:[
                {
                    model:User,
                    as:'user',
                    where: condition, 
                    include: [
                        {
                            model: Role,
                            as: 'role',
                            attributes: ['role']
                        }
                    ],
                    
                }
                
            ],
            limit, offset,
        }

    )
        .then(patients => {
            const response = getPagingData(patients, page, limit);

            return res.status(200).json({ response });
        }).catch(err => { res.status(500).json({ erreur: err.message }); });

    }
    ,
    getPatient(req,res){
        Patient.findAll({
            order: [
                ['createdAt', 'DESC'],
                   
                ],
            include:[
                {
                    model:User,
                    as:'user',
                    
                    include: [
                        {
                            model: Role,
                            as: 'role',
                            attributes: ['role']
                        }
                    ],
                    
                }
            ]

        }).then(patient=>{
            return res.status(200).json({message :'all patient', patient});
        })
    },
    getMedecin(req,res){
        
        Medecin.findAll({
            order: [
                ['createdAt', 'DESC'],
                   
             ],
            include:[
                {
                    model:User,
                    as:'user'
                }
            ]

        }).then(medecin=>{
            return res.status(200).json({message :'all patient', medecin});
        })
    },
    // async getMedecinByName(req,res){
    //     User.findAll({
    //         order: [
    //             ['nom', 'DESC'],
                   
    //          ],
    //          where:{
    //             idRole:5
    //          },include: [{
    //             model: Medecin,
    //             as: 'medecin'
    //         }],
            
    //     }).then(user=>{
    //         return res.status(200).json(user)
    //     })
    // },


    getMedecinByName(req, res){
console.log("salam" + req.body.idPatient)
        Patient.findOne({
        where : {
            idPatient : req.body.idPatient
        }
    })
    .then(patient =>{
        if(!patient){
            res.status(500).json({message : "patient introuvable"});
        }
        else{
            Medecin.findAll({
                
                where : {
                        idMedecin : {
                            [Op.notIn] :  Sequelize.literal(
                                '( SELECT "idMedecin" ' +
                                    'FROM public."Permissions" ' +
                                   'WHERE "idPatient" = ' + patient.idPatient+
                                   'AND "idMedecin" is not null'+

                                ')')
                        }  },

                include : [
                    {
                        model : User,
                        as : 'user',
                       
                    }
                ],
                
              distinct : true,
               
         }).then(medecins => {
           
                res.status(200).json(medecins);
            
            }).catch(err => {res.status(500).json({ message : err.message });});
        }
    })
    .catch(err => {res.status(500).json({ message : err.message });});

    },
    
    infoUser(req, res) {
        User.findOne({
            where: {
                identifiant: req.body.identifiant
                
            },
            include: [
                {
                    model: Role,
                    as: 'role'
                },
                {
                    model: Medecin,
                    as: 'medecin'
                },
                {
                    model: Patient,
                    as: 'patient'
                },
                {
                    model: Userlabo,
                    as: 'labo'
                }
            ]
        }).then(user => {
            if (user) {
                res.status(200).json({ message: 'success', data: user })
            } else {
                res.status(500).json({ message: 'error user not found' })
            }

        }).catch(error => {
            res.status(500).json({ message: 'error data not found' })
        })
    },
    deleteUser(req, res) {
        
        User.findOne({
            where:{
                identifiant:req.body.identifiant
            }
        }).then(user=>{
            user.destroy()
            num.setHistorique(req.body.userLabo,'suppression',' suppression de compte de l\'utilisateur'+req.body.identifiant)
            res.status(200).json({message:'success'})
        }).catch(err => {res.status(500).json({ erreur: err.message });});
    },
    updateUser(req, res) {
      
        const idUser = req.body.identifiant;
       
        try {
            if (!idUser) {
                return res.status(500).json({ message: 'user not defined' })
            } else {
                const userData = {
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    sexe: req.body.sexe,
                    dateNaissance: req.body.dateNaissance,
                    telephone: req.body.telephone,
                    adresse: req.body.adresse,
                    etatCivil: req.body.etatCivil,
                    cin: req.body.cin,
                    ville:req.body.ville,
                    email : req.body.email
                }
             
                User.findOne({
                  where : {
                        email : {  [Op.eq]: req.body.email},
                        identifiant : {  [Op.ne]: req.body.identifiant}
                    }


                }).then(Utilisateur =>{
                        if(Utilisateur){
                            res.status(500).json({ message: 'Email existe déjà ' });
                        }
                        else{
                            User.findOne({
                                where: {
                                    identifiant: idUser
                                }
                            }).then(user => {
                                if (user) {
                                    num.setHistorique(req.body.userLabo,'modification','modification des informations de l\'utilisateur '+user.identifiant)
            
                                    return user.update(userData).then(() =>
                                        res.status(200).json({ message: 'update success', user }));
                                } else {
                                    return res.status(500).json({ message: 'user not found' })
                                }
            
            
                            }).catch(err => {
                                res.status(500).json({ message: err.message });
                            });
                        }
                }).catch(err => {res.status(500).json({ message : err.message });});

               
            }

        } catch (error) {
            res.status(500).json({ message: error.message });

        }


    },
    lockUnlockUser(req, res) {
        if (!req.body.identifiant) {
            return res.status(500).json({ message: 'identifiant require' });
        }
        User.findOne({
            where: {
                identifiant: req.body.identifiant
            }
        }).then(user => {
            if (!user) {
                return res.status(500).json({ message: 'user not found' });
            }
            if (user.isLock == true) {
                user.update({
                    isLock: false
                }).then(u=>{
                    num.setHistorique(req.body.userLabo,'déblocage','déblocage du compte de l\'utilisateur '+user.identifiant)

                    res.status(200).json({ message: 'Compte débloqué', user });
                })
                    
                    
            }
            else {

                user.update({
                    isLock: true
                }).then(s=>{
                    num.setHistorique(req.body.userLabo,'blocage','blocage de compte de l\'utilisateur '+user.identifiant)

                         res.status(200).json({ message: 'Compte bloqué', user });
                })
               
            }
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
    },

    // getAlluserpagination(req, res) {
    //     if(!req.body.identifiant)
    //     {
    //         res.status(500).json({ message: 'identifiant require' });
    //     }
    //     console.log(req.method)
    //     // let page = parseInt(req.query.page);
    //     //     let limit =parseInt(req.query.limit);
    //         const page = req.query.page;
    //         const size = req.query.size;
    //     try {
    //         User.findAndCountAll({
                
    //             order: [
    //                 ['createdAt', 'ASC'],
                       
    //                 ],
    //             include: [
    //                 {
    //                     model: Role,
    //                     as: 'role'
    //                 },
    //                 {
    //                     model: Medecin,
    //                     as: 'medecin'
    //                 },
    //                 {
    //                     model: Patient,
    //                     as: 'patient'
    //                 },
    //                 {
    //                     model: Userlabo,
    //                     as: 'labo'
    //                 }

    //             ],
              
                
    //             limit: size,
    //             offset : page * size
    //         }).then(users => {
    //             // const totalPages = Math.ceil(data.count / limit);
    //             return res.status(200).json({users})
    //         }).catch(err => {
    //             res.status(500).json({ message: 'error data' });
    //         });
    //     } catch (error) {

    //     }
    countPatient(req,res){
        User.count({
            where:{
                idRole:4,
                isConnected:true
            },include: [{
                model: Patient,
                as: 'patient'
            }],
        }).then(user=>{
            return res.status(200).json({user})
        })
    },
    searhnotification(req,res){
        console.log('====================',req.body)
        User.findOne({
            where:{
                identifiant:req.body.identifiant
            }
        }).then(user=>{
           
            if (req.body.typenotification==undefined  ) {
                Notification.findAndCountAll({
                    where:{
                        idUtilisateur:user.idUtilisateur, 
                        dateNotification : req.body.dateNotification,
                    }
                  
                }).then(notif=>{
                    res.status(200).json(notif)
                })
            } else if(req.body.dateNotification==undefined) {
                
                Notification.findAndCountAll({
                    where:{
                        idUtilisateur:user.idUtilisateur, 
                       
                        typeNotification : req.body.typenotification  
                    }
                  
                }).then(notif=>{
                    res.status(200).json(notif)
                }) 
                
            }else{
                Notification.findAndCountAll({
                    where:{
                        idUtilisateur:user.idUtilisateur, 
                        dateNotification : req.body.dateNotification,
                        typeNotification : req.body.typenotification  
                    }
                  
                }).then(notif=>{
                    res.status(200).json(notif)
                })
            }
              

                    
                
            })
         
               
            
      
    },
    coutnMedecin(req,res){
        User.count({
            where:{
                idRole:5,
                isConnected:true
            },include: [{
                model: Medecin,
                as: 'medecin'
            }],
        }).then(user=>{
            return res.status(200).json({user})
        })
    },
    
    getCRR(req,res){
        var today = new Date();
        var dd = today.getDate();
        
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        today = mm+'-'+dd+'-'+yyyy;
        try {
            CompteRendu.findAndCountAll({
                where:{
                    dateCreation: today
                },
                order: [
                ['createdAt', 'DESC'],
                   
                ],
                limit:60,
            include:[
                {
                    model: Permission,
                    as: 'permission',
                    include:[{
                        model:Patient,
                        as:"patient",
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['nom', 'prenom','email','identifiant'],
                               
                            },
                            
                        ],
                        
                    },
                    {
                        model:Medecin,
                        as:"medecin",
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['nom', 'prenom','email','identifiant'],
                               
                            },
                            
                        ],
                        
                    },
                ]
                    
                    
                }
            ]
                
            }).then(data=>{
                return res.status(200).json(data)
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    getCRRDuJour(req, res){
        const {dateCreation, page, size } = req.body
    
        var condition = dateCreation? { dateCreation : { [Op.eq]: `${dateCreation}` }} : null;
        const { limit, offset } = getPagination(page, size);
        CompteRendu.findAndCountAll({
            where : 
                condition
            , attributes : ['idCRR','path','dateCreation', 'numDossier'],
            include : [
                {
                    model :Permission,
                    as : 'permission',
                    attributes : ['idPatient','idMedecin','idCRR'],
                    include : [{
                        model : Patient,
                        as : 'patient',
                        attributes : ['idUtilisateur'],
                        include : [{
                            model : User,
                            as : 'user',
                            attributes : ['nom', 'prenom','nomComplet'],
                        }]
                    },
                {
                    model : Medecin,
                    as : 'medecin',
                    attributes : ['idUtilisateur'],
                    include : [{
                        model : User,
                        as : 'user',
                        attributes : ['nom', 'prenom','nomComplet'],
                    }]
                }]
                }
            ],
            distinct : true,
            limit, offset
        }).then(crr =>{
            const response = getPagingData(crr, page, limit);
            res.status(200).json({ response});
        }).catch(err => {res.status(500).json({ erreur: err.message });});
    },



    getNotification(req,res){
        const { page, size,  typeNotification, dateNotification, colonne, ordre} = req.body;
        

        console.log(colonne);
        console.log(ordre);
        var condition = typeNotification ? { typeNotification: { [Op.like]: `${typeNotification}` } } : null;
        var condition1 = dateNotification? { dateNotification : { [Op.eq]: `${dateNotification}` }} : null;
        const { limit, offset } = getPagination(page, size);
        User.findOne({
            where:{
                identifiant:req.body.identifiant
            }
        
        }).then(user=>{
            var idUtilisateur = user.idUtilisateur
            var condition0 = idUtilisateur ? { idUtilisateur : { [Op.eq]: idUtilisateur} } : null;
            console.log(condition0);
            Notification.findAndCountAll({
                order: [
                    [colonne, ordre],
                       
                    ],
               
            where:{
                [Op.and] : [condition0,   condition,  condition1
                  
            ]
            },
            limit, offset
        }).then(notif=>{
            if(!notif){
                res.status(200).json({message : 'Pas de notifications'});
            }
            const response = getPagingData(notif, page, limit);

            return res.status(200).json({response})
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
        }).catch(err => {res.status(500).json({ erreur: err.message });});
        
    },
    getNotificationNonLus(req,res){
        User.findOne({
            where:{
                identifiant:req.body.identifiant
            },
            order: [
                ['createdAt', 'DESC'],
                   
            ],
        }).then(user=>{
            Notification.findAll({
               
                order: [
                    ['createdAt', 'DESC'],
                       
                    ],
               
            where:{
                idUtilisateur:user.idUtilisateur,
                status : false
                
            }
        }).then(notif=>{
            return res.status(200).json(notif)
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
        })
        
    },
    setNotification(req,res){
        console.log(req.body)
        User.findOne({
            where:{
                identifiant:req.body.identifiant
            }
        }).then(user=>{
                Notification.findOne({
                where:{
                    idUtilisateur:user.idUtilisateur,
                    idNotification:req.body.idNotification
                }
            }).then(notif=>{
                notif.update({
                    status: true

                }).then(stat=>{
                    Notification.count({
                        where :{
                            status: false,
                            idUtilisateur:user.idUtilisateur,

                        }
                    }).then(nbrnotif=>{
                        console.log(nbrnotif)
                        socket.ioObject.emit("nbrNotif", nbrnotif);
                       
                    })
                   
                    return res.status(200).json(stat)
                })
               
            })
        
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
       
        
    }
    ,
    countnotification(req,res){
        User.findOne({
            where:{
                identifiant:req.body.identifiant
            }
        }).then(user=>{
            Notification.findAndCountAll({
                order: [
                    ['createdAt', 'DESC'],
                       
                    ],
               
            where:{
                idUtilisateur:user.idUtilisateur,
                status:false
                
            }
        }).then(notif=>{
            return res.status(200).json(notif)
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
        })
        
    },

    // },
    getCRRbyDate(req,res){
        
        try {
            CompteRendu.findAndCountAll({
                where:{
                    dateCreation: req.body.date
                },
                order: [
                ['createdAt', 'DESC'],
                   
                ],
                limit:60,
            include:[
                {
                    model: Permission,
                    as: 'permission',
                    include:[{
                        model:Patient,
                        as:"patient",
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['nom', 'prenom','email','identifiant'],
                               
                            },
                            
                        ],
                        
                    },
                    {
                        model:Medecin,
                        as:"medecin",
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['nom', 'prenom','email','identifiant'],
                               
                            },
                            
                        ],
                        
                    },
                ]
                    
                    
                }
            ]
                
            }).then(data=>{
                return res.status(200).json(data)
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    getListeMedecinOfPatient(req, res, next) {

        User.findOne({ where: { identifiant: req.body.identifiant }})
            .then(user => 
                        {
                            Patient.findOne({ where : { idUtilisateur : user.idUtilisateur}})
                          .then(patient => 
                                                {
                                                Medecin.findAll({   
                                                        distinct: true,
                                                        where : { '$permission.idPatient$': patient.idPatient, },
                                                        
                                                        include : [                                                    
                                                          {
                                                            model: User,
                                                            as: 'user',
                                                            attributes: ['nom', 'prenom','email','identifiant','idUtilisateur'],
                                                           
                                                        },
                                                          
                                                          {
                                                          model : Permission,
                                                          as : 'permission', 
                                                          where : {permission : true},
                                                        
                                                          
                                                        
                                                        
                                                        },
                                                        
    
                                                          
                                                           
                                                        ]
                                                }).then(permission => {
                                                  return res.status(200).json({  permission });                                            })
                                                })
                       })
            .catch(err => {res.status(500).json({ erreur: err.message });});
     
            
        },
    
        retrievePrermission(req, res) {
        
            Permission.findOne({
                where:{
                    idPermission:req.body.idPermission
                }
            }).then(permission=>{
                permission.update({
                    idMedecin:null  
                })
                num.setHistorique(req.body.userLabo,'suppression','labo a resilier la permission pour le medecin: '+req.body.medecin+' de consulter le compte rendu du patient: '+req.body.patient)
                res.status(200).json({message:'success'})
            }).catch(err => {res.status(500).json({ erreur: err.message });});
        },
    //get profile de l'admin laboratoire / admin Silogik
    ProfileAdmin(req, res) {
        if (req.body.identifiant) {
            User.findOne({
                where: {
                    identifiant: req.body.identifiant
                },
               
            }).then(user => {
                if (user) {
                    return res.status(200).json({ message: 'Information admin : ',user  })
                } else {
                    return res.status(400).json({ message: 'admin n existe pas ' })
                }
            }).catch(err => {
                res.status(500).send("Fail! Error -> " + err);
            })
        } else {
            return res.status(400).json({ message: 'identifiant require' })
        }
    },


    SelectDate(req, res){
        CompteRendu.findAll({
            where: sequelize.where(sequelize.fn('week',  CompteRendu.sequelize.fn('now')), 
            sequelize.fn('week',  CompteRendu.sequelize.col('createdAt'))),
        }).then(crr => {
            return res.status(200).json(crr)
        }).catch(err => {res.status(500).json({ erreur: err.message });});
    }

  
      
    








}