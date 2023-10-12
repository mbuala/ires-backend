const Patient = require('../models').Patient;
const User = require('../models').Utilisateur;
const bcrypt = require('bcrypt');
const Role = require('../models').Role;
const Permission = require('../models').Permission;
const CCR = require('../models').CompteRendu;
const Medecin = require('../models').Medecin;
const Reclamation = require('../models').Reclamation;
const Sequelize = require('sequelize');
const num = require('./functionnality');

const Op = Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };
  };

  
module.exports = {
    updatePatient(req, res) {
        const idUser = req.params.identifiant;
        const userData = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            sexe: req.body.sexe,
            dateNaissance: req.body.dateNaissance,
            telephone: req.body.telephone,
            email: req.body.email,
            adresse: req.body.adresse,
            etatCivil: req.body.etatCivil,
            cin: req.body.cin,


        }
        User.findOne({
            where: {
                identifiant: idUser,
            },
            include: [{
                model: Role,
                as: 'role',



            }],




        }).then(user => {

            return user.update(userData).then(() =>
                res.status(200).json({ message: 'update success', user }));

        }).catch(err => {
            res.status(500).json({ message: err.message });
        });


    },
    //upload image
    updateProfil(req, res) {

    },
    deletePatient(req, res) {

    },
    updatePassword(req, res) {

        console.log('===================>',req.body)
        User.findOne({
            where: {
                identifiant: req.body.identifiant
            }
        }).then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Utilisateur introuvable' })
            } else {

                bcrypt.compare(req.body.oldPassword, user.motDePasse, function (err, ress) {

                    if (!ress) {
                        res.status(400).json({ message: 'Mot de passe actuel est Invalide ' })
                    } else {
                        
                        bcrypt.compare(req.body.newPassword, user.motDePasse, function (err, ress) {
                            if(ress){
                                res.status(500).json({ message: 'Le nouveau mot de passe doit etre different de l \'ancien ' })
                            }
                            else
                            {  num.setHistorique(user.idUtilisateur,'modification','modification du mot de pass')
                              user.update({ motDePasse: bcrypt.hashSync(req.body.newPassword, 10) }).then(() =>
                                  res.status(200).json({ message: 'Votre mot de passe est changé' }));}
                        });



                    }

                });

            }
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });

    },
    // afficher la liste compte rendus pour le patient
    getListeCrr(req, res) {
        console.log('============>',req.body)
        if (!req.body.identifiant) {
          return  res.status(200).json({ message: 'identifiant require' });
        }
        User.findOne({
            where: {
                identifiant: req.body.identifiant
            },
        }).then(user => {
            if (!user) {
                res.status(200).json({ message: 'user not found' });
            }
            Patient.findOne({
                where: {
                    idUtilisateur: user.idUtilisateur
                }
            }).then(patient => {
                if (!patient) {
                    res.status(200).json({ message: 'patient not found' });
                }
                Permission.findAll({

                    where: {
                        idPatient: patient.idPatient,
                        permission:true
                    },

                    include: [
                        {
                            model: CCR,
                            as: 'compterendu'
                        },
                        {
                            model: Medecin,
                            as: 'medecin',
                            
                            include: [
                                {
                                    model: User,
                                    as: 'user',
                                    attributes: ['nom', 'prenom'],
                                    group: ['nom']
                                }
                            ]


                        }


                    ]
                }).then(permission => {
                   
            
                    return res.status(200).json({ user, permission,patient });
                })
            })
        }).catch(err => { res.status(500).json({ erreur: err.message }); });
    },

    getInfoPatient(req, res) {
        if (req.body.identifiant) {

            User.findOne({
                where: {
                    identifiant: req.body.identifiant

                },
                include: [{
                    model: Patient,
                    as: 'patient',
                    attributes: ['ipp']
                }
                ]
            }).then(user => {
                if (user) {
                    return res.status(200).json({ message: 'Information patient : ', user })

                } else {
                    return res.status(400).json({ message: 'patient n existe pas ' })

                }
            }).catch(err => {
                res.status(500).send("Fail! Error -> " + err);
            })
        } else {
            return res.status(400).json({ message: 'identifiant require' })
        }

    },



    searchCrr(req, res) {

        if (req.body.numDossier || req.body.medecinPrescripteur) {
            User.findOne({
                where: {
                    identifiant: req.params.identifiant
                },
            }).then(user => { //

                if (!user) {
                    res.status(200).json({ message: 'user not found' });
                }
                Patient.findOne({
                    where: {
                        idUtilisateur: user.idUtilisateur
                    }
                }).then(patient => {
                    if (!patient) {
                        res.status(200).json({ message: 'patient not found' });
                    }

                    Permission.findAll({

                        where: {
                            idPatient: patient.idPatient
                        },

                        include: [
                            {
                                model: CCR,
                                as: 'compterendu',
                                where: {
                                    numDossier: req.body.numDossier
                                }
                            },
                            {
                                model: Medecin,
                                as: 'medecin',

                            }]
                    }).then(permission => {
                        if (permission.length == 0) {
                            return res.status(200).json({ message: 'CRR Introuvable' });
                        }
                        return res.status(200).json({ user, permission });



                    })






                })





            }).catch(err => { res.status(500).json({ erreur: err.message }); });

        }

        else {
            res.status(500).json({ erreur: 'Num dossier require' });
        }

    },




 
    // get liste Crr avec pagination and search
    getListeCrrPag(req,res){

        if(!req.body.identifiant){
                res.status(500).json({message : 'identifiant require'});
       }


             const { page, size, numDossier, nomMedecin, dateDebut, dateFin} = req.body;
             let colonne = req.body.colonne;
             let ordre = req.body.ordre;
             console.log(page);
             console.log(size);
          
             var condition = numDossier ? { numDossier: { [Op.like]: `%${numDossier}%` } } : null;
         
             var con = nomMedecin ? {
                [Op.or]: [

                    Sequelize.where(

                        Sequelize.fn("concat", Sequelize.col("nom"), ' ',  Sequelize.col("prenom")), {
                         [Op.like]: `%${nomMedecin}%` , },),


                 Sequelize.where(

                        Sequelize.fn("concat", Sequelize.col("prenom"), ' ',  Sequelize.col("nom")), {
                         [Op.like]: `%${nomMedecin}%` , },),

                ]
              } : null;
         


             if(dateDebut && dateFin)
           {   
            conditio = { dateCreation :  { [Op.between] : [ dateDebut, dateFin ] }}
            console.log("les deux dates")
             
        
           }
           else if(dateDebut){
             
            conditio = { dateCreation :  {  [Op.gte]: dateDebut}}
            console.log("dateDebut")
           }
           else if(dateFin){
            conditio = { dateCreation :  {  [Op.lte]: dateFin }}
            console.log("DateFin")
           }
        else{
               conditio = null;
        }

             

   

             const { limit, offset } = getPagination(page, size);


         User.findOne({
         where: {
         identifiant: req.body.identifiant
         },
         }).then(user =>{
        if(!user){
                 res.status(200).json({message : 'user not found'});
             }
                 Patient.findOne({
                     where : {
                         idUtilisateur : user.idUtilisateur
                     }
                 }).then(patient =>{
                     if(!patient){
                         res.status(200).json({message : 'patient not found'});
                     }
                                    Permission.findAndCountAll({
                                    

                                         where : {
                                             idPatient : patient.idPatient,
                                        },
                                       
                                         order:[ 
                                            [{model: CCR, as: 'compterendu'},colonne, ordre],
                                           
                                        ],

                                         include: [
                                                                    {
                                                                model:CCR,
                                                                as:'compterendu',
                                                                        where : 
                                                                     {   [Op.and] : [ conditio,
                                                                                    condition,
                                                                                ]},
                                                                      },
   {
                                                                model:Medecin,
                                                                as:'medecin',
                                                                where  : {
                                                                    
                                                                },
                                                                                                include :[
                                                                                                    {
                                                                                                        model : User,
                                                                                                        as : 'user',
                                                                                                        where :  con,
                                                                                                      
                                                                                                        attributes : ['nom', 'prenom','nomComplet', 'telephone'],
                                                                                                        required: true
                                                                                                      
                                                                                                    }      ]
                                                                         }
      ],
                                   
                                      limit, offset
                                    }).then(permissions =>{
                                         if(permissions.length == 0){
                                             res.status(200).json({message : 'CRR Introuvable'});
                                           console.log('cc');
                                         return;
                                         }
                                         const response = getPagingData(permissions, page, limit);


                                         return   res.status(200).json({response});
                                       }).catch(err => {res.status(500).json({ erreur: err.message });});
         })}).catch(err => {res.status(500).json({ erreur: err.message });});
    },

    getListeMedecinPagination(req, res){

        const { page, size, nomMedecin, specialite} = req.body;
        const { limit, offset } = getPagination(page, size);
        let colonne = req.body.colonne;
        let ordre = req.body.ordre;
      console.log(page)
      console.log(size)
      console.log(nomMedecin)
      console.log(specialite)
      console.log(colonne)
      console.log(ordre)
    
       
        var con = nomMedecin ? {
            [Op.or]: [

                Sequelize.where(

                    Sequelize.fn("concat", Sequelize.col("nom"), ' ',  Sequelize.col("prenom")), {
                     [Op.like]: `%${nomMedecin}%` , },),


             Sequelize.where(

                    Sequelize.fn("concat", Sequelize.col("prenom"), ' ',  Sequelize.col("nom")), {
                     [Op.like]: `%${nomMedecin}%` , },),

            ]
          } : null;

         
        
    User.findOne({
        where : { identifiant : req.body.identifiant},
        attributes : ['idUtilisateur' , 'identifiant']
    }).then(user =>{
        if(!user){

            res.status(500).json({messagege : "utilisateur introuvable"});
            
        }
        Patient.findOne({
            where : { idUtilisateur : user.idUtilisateur},
            attributes : ['idPatient']
        }).then(patient =>{
            if(!patient){

                res.status(500).json({message : "patient introuvable"});
                
            }




                Medecin.findAndCountAll({
                
                    where : {
                            idMedecin : {
                                [Op.in] :  Sequelize.literal(
                                    '( SELECT "idMedecin" ' +
                                        'FROM public."Permissions" ' +
                                       'WHERE "idPatient" = ' + patient.idPatient+

                                    ')')
                            },

                            specialite: { [Op.like]: `%${specialite}%` }

                            

                    },
                  
                 
                    // attributes :['idMedecin', 'specialite'],
                   
                    include : [
                        {
                            model : User,
                            as : 'user',
                            where : con,
                            //  required :true,
                            //  order : ['nom', 'DESC'],
                            // attributes : ['nom', 'prenom', 'dateNaissance', 'telephone'],
                           
                        }
                    ],
                    order:[ 
                        [{ model: User , as: 'user'}, colonne, ordre],
                       
                    ],
                   
                    // required : true,
                  
                    distinct : true,
                   
                    limit,offset,
                   






                }).then(medecins =>{
                    if(!medecins){

                        res.status(500).json({message : "Pas de medecins prescripteurs"});
                       
                    }
                    const response = getPagingData(medecins, page, limit);
                    res.status(200).json({response});
                }).catch(err => {res.status(500).json({ erreur: err.message  });});




        }).catch(err => {res.status(500).json({ erreur: err.message });});


    }).catch(err => {res.status(500).json({ erreur: err.message  });});


    },


    getListePatientMedcin(req, res){
        const { page, size, numDossier, nomPatient } = req.body;
       var condition = numDossier ? { numDossier: { [Op.like]: `%${numDossier}%` } } : null;
        var con = nomPatient ? {
            [Op.or]: [
    
                Sequelize.where(
    
                    Sequelize.fn("concat", Sequelize.col("nom"), ' ',  Sequelize.col("prenom")), {
                     [Op.like]: `%${nomPatient}%` , },),
    
    
             Sequelize.where(
    
                    Sequelize.fn("concat", Sequelize.col("prenom"), ' ',  Sequelize.col("nom")), {
                     [Op.like]: `%${nomPatient}%` , },),
    
            ]
          } : null;
          const { limit, offset } = getPagination(page, size);
        User.findOne({ where: { identifiant: req.body.identifiant }})
            .then(user =>
                        {
                          Medecin.findOne({ where : { idUtilisateur : user.idUtilisateur}})
                          .then(medecin =>
                                                {
                                                Patient.findAndCountAll(
                                                    {
    
    
    
                                                        include : [
    
                                                            {
                                                                model : Permission,
                                                                as : 'permission',
    
                                                                where : {
                                                                    // permission : true,
                                                                     idMedecin : medecin.idMedecin,
    
                                                                 },
                                                                 duplicating: false,
    
                                                                 required: true,
    
    
    
                                                                include : [
                                                                    {
                                                                        model : CCR,
                                                                        as : 'compterendu',
    
                                                                        // condition = numDossier ? { numDossier: { [Op.like]: `%${numDossier}%` } } : null;
    
                                                                        // where : {
                                                                        //     numDossier : {
    
                                                                        //         [Op.like] :  Sequelize.literal( `%${numDossier}%`)
    
                                                                        //     }
                                                                        // },
    
                                                                      where :  condition ,
    
    
    
    
    
                                                                    },
    
                                                                ],
    
    
    
    
                                                            },
    
                                                            {
                                                                model : User,
                                                                as : 'user',
                                                              where : con,
    
                                                             },
    
    
                                                                  ],
    
                                                        required: true,
    
                                                           distinct: true,
    
                                                           limit, offset,
    
                                                        //
    
    
    
    
    
                                                }
    
                                                    )
                                                .then(patients => {
                                                    const response = getPagingData(patients, page, limit);
    
                                                    return res.status(200).json({response});
                                                }).catch(err => {res.status(500).json({ erreur: err.message });});
    
    
    
    
    
    
    
                                                }).catch(err => {res.status(500).json({ erreur: err.message });});
    
    
    
    
    
    
                       })
            .catch(err => {res.status(500).json({ erreur: err.message });});
    
    
    
    
    
    
    },
    getlisteCrrPatientMedecin(req, res){
        if(!req.body.identifiant){
            res.status(500).json({message : 'identifiant require'});
    }
    
    
    const { page, size, numDossier ,dateDebut, dateFin,} = req.body;
         var condition = numDossier ? { numDossier: { [Op.like]: `%${numDossier}%` } } : null;
         const { limit, offset } = getPagination(page, size);
         
         if(dateDebut && dateFin)
           {   
            conditio = { dateCreation :  { [Op.between] : [ dateDebut, dateFin ] }}
            console.log("les deux dates")
             
        
           }
           else if(dateDebut){
             
            conditio = { dateCreation :  {  [Op.gte]: dateDebut}}
            console.log("dateDebut")
           }
           else if(dateFin){
            conditio = { dateCreation :  {  [Op.lte]: dateFin }}
            console.log("DateFin")
           }
        else{
               conditio = null;
        }
         User.findOne({
            where: {
                identifiant: req.body.identifiant
                },
         }).then(user =>
            {
              Medecin.findOne({
                where: {
                    idUtilisateur : user.idUtilisateur
                    },
              }).then(medecin=> {
    
    
             Permission.findAndCountAll({
                 where : {
    
                   idMedecin : medecin.idMedecin,
                   idPatient : req.body.idPatient,
                   permission : true
                 },
                 include : [
                     {
                         model : CCR,
                         as : "compterendu",
                         where : 
                         {   [Op.and] : [ conditio,
                                        condition,
                                    ]}
                     }
                 ]
                 , limit, offset,
             }).then( permissions => {
    
                const response = getPagingData(permissions, page, limit);
    
                res.status(200).json({response});
             }).catch(err => {res.status(500).json({ erreur: err.message });});
    
    
    
              }).catch(err => {res.status(500).json({ erreur: err.message });});
    
    
            }).catch(err => {res.status(500).json({ erreur: err.message });});
    
    },
    
    
    VoirCrrPatient(req, res){
        let idCRR= req.body.idCRR

        CCR.findOne({
            where : { idCRR : idCRR}
        }).then(compteRendu => {
            if(!compteRendu){
                console.log('Compte Rendu introuvable')
            }
            compteRendu.update({ statutCRRPatient: true }).then(() => {

                return   res.status(200).json({message : 'mise a jour reussie'});

            }).catch(err => {res.status(500).json({ erreur: err.message });});

        }).catch(err => {res.status(500).json({ erreur: err.message });});
    },
    VoirCrrMedecin(req, res){
        let idCRR= req.body.idCRR

        CCR.findOne({
            where : { idCRR : idCRR}
        }).then(compteRendu => {
            if(!compteRendu){
                console.log('Compte Rendu introuvable')
            }
            compteRendu.update({ statutCRRMedecin: true }).then(() => {

                return   res.status(200).json({message : 'mise a jour reussie'});

            }).catch(err => {res.status(500).json({ erreur: err.message });});

        }).catch(err => {res.status(500).json({ erreur: err.message });});
    },
    ProfilePatient(req, res) {
        if (req.body.identifiant) {
            User.findOne({
                where: {
                    identifiant: req.body.identifiant
                },
               
            }).then(user => {
                if (user) {
                    Patient.findOne({
                        where : {
                            idUtilisateur : user.idUtilisateur
                        },
                         attributes :['idPatient', 'ipp']
                    }).then(patient =>{
                        return res.status(200).json({ message: 'Information patient : ',user,patient })
                    }).catch(err => {res.status(500).json({ erreur: err.message });});
                } else {
                    return res.status(400).json({ message: 'patient n existe pas ' })
                }
            }).catch(err => {
                res.status(500).send("Fail! Error -> " + err);
            })
        } else {
            return res.status(400).json({ message: 'identifiant require' })
        }
    },
  

}