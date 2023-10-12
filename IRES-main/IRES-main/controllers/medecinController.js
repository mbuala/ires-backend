const Medecin = require('../models').Medecin;
const User = require('../models').Utilisateur;
const bcrypt = require('bcrypt');
const Role = require('../models').Role;
const Patient = require('../models').Patient;
const CCR = require('../models').CompteRendu;
const Permission = require('../models').Permission
const Notification = require('../models').Notification;
const Activite = require('../models').Activite;
const Historiquemedecin = require('../models').Historiquemedecin;
const Historique = require('../models').Historique;
const Sequelize = require('sequelize');


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
  /*
    HISTORIQUE
    ACTIVITE TYPE ACTIVITE EST UPDATE INFORMATION
    HISTORIQUE PATIENT
    req.method=PUT
  */
  updateMedecin(req, res, next) {
    const idUser = req.body.identifiant;
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
    }).then(user => {
      user.update(userData).then(() => {
        const nomActivite = 'modification';
        Activite.findOne({
          where: {
            nomActivite: nomActivite

          }
        }).then(activite => {
          console.log(',======================>', activite)
          Historique.create({
            idActivite: activite.idActivite,
            dateHistorique: new Date(),
            idUtilisateur: user.idUtilisateur,
            message: 'Le médecin ' + user.nom + ' a modifier ces informations personnelles'
          }).then(historique => {
            Historiquemedecin.create({
              idHistorique: historique.idHistorique
            }).then(hstmed => {
              return res.status(200).json({ message: 'update success', user, historique, activite, hstmed });
            }).catch(err => {
              res.status(400).json({ message: err.message });
            });
          }).catch(err => {
            res.status(400).json({ message: err.message });
          });
        }).catch(err => {
          res.status(403).json({ message: err.message });
        });
      }).catch(err => {
        res.status(406).json({ message: err.message });
      });
    }).catch(err => {
      res.status(304).json({ message: err.message });
    });

  },
  //upload image
  updateProfil(req, res) {

  },
  deletePatient(req, res) {

  },
  updatePassword(req, res) {


    User.findOne({
      where: {
        identifiant: req.body.identifiant
      }
    }).then(user => {
      if (!user) {
        return res.status(400).json({ message: 'user not found' })
      } else {


        bcrypt.compare(req.body.oldPassword, user.motDePasse, function (err, ress) {

          if (!ress) {
            res.status(400).json({ message: 'votre mot de passe actuel est invalide' })
          } else {
            if(req.body.newPassword === user.motDePasse){
              res.status(400).json({ message: 'Le nouveau mot de passe doit etre different de l \'ancien ' })
            }
            else
         {  
            user.update({ motDePasse: bcrypt.hashSync(req.body.newPassword, 10) }).then(() =>
              res.status(200).json({ message: 'your password has been update' }));
            }
          }
        });


      }
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });

  },
  /*
MODIFICATION DU PASSWORD PAR LE 
MEDECIN identifiant: 2021silogik1150 
PASSWORD: test1
 */
  updatePasswordMedecin(req, res, next) {
    User.findOne({
      where: {
        identifiant: req.body.identifiant
      }
    }).then(user => {
      if (!user) {
        return res.status(400).json({ message: 'user not found' })
      } else {

        bcrypt.compare(req.body.oldPassword, user.motDePasse, function (err, ress) {

          if (!ress) {
            res.status(400).json({ message: 'your password is false' })
          } else {
            user.update({ motDePasse: bcrypt.hashSync(req.body.password, 8) }).then(u => {

              const nomActivite = 'modification';
              Activite.findOne({
                where: {
                  nomActivite: nomActivite

                }
              }).then(activite => {
                Historique.create({
                  idActivite: activite.idActivite,
                  dateHistorique: new Date(),
                  idUtilisateur: user.idUtilisateur,
                  message: 'Le médecin ' + user.nom + ' a modifier son mot de passe'
                }).then(historique => {
                  Historiquemedecin.create({
                    idHistorique: historique.idHistorique
                  }).then(hstmed => {
                    return res.status(200).json({ message: 'your password has been update', user: user, hstmed })
                  })
                })
              })
            });

          }
        });


      }
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
  },
  updateProfileMedecin(req, res, next) {

  },

  /*
MISE A JOUR DES INFOS APRES LA CREATION DE SON 
COMPTE MEDECIN identifiant :2021silogik1150 
 */
  updateinfomedecin(req, res) {
    const idUser = req.params.identifiant;
    const userData = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      sexe: req.body.sexe,
      dateNaissance: req.body.dateNaissance,
      telephone: req.body.telephone,
      adresse: req.body.adresse,
      etatCivil: req.body.etatCivil,
      cin: req.body.cin,


    }
    User.findOne({
      where: {
        identifiant: idUser,
      },

    }).then(user => {

      return user.update(userData).then(() =>
        res.status(200).json({ message: 'update success', user }));

    }).catch(err => {
      res.status(500).json({ message: err.message });
    });

  },

  /*
  RECUPERATION DES PATIENTS AYANT 
  LE MEDECIN identifiant :2021silogik1150 
  ET LES COMPTES RENDUS DONT IL A L'AUTORISATION PERMISSION

  */
  getListePatient(req, res, next) {

    User.findOne({ where: { identifiant: req.body.identifiant }})
        .then(user => 
                    {
                      Medecin.findOne({ where : { idUtilisateur : user.idUtilisateur}})
                      .then(medecin => 
                                            {
                                            Patient.findAll({   
                                                    distinct: true,
                                                    where : { '$permission.idMedecin$': medecin.idMedecin, },
                                                    
                                                    include : [                                                    
                                                      {
                                                        model: User,
                                                        as: 'user',
                                                       
                                                       
                                                    },
                                                      
                                                      {
                                                      model : Permission,
                                                      as : 'permission', 
                                                      where : {permission : true},
                                                    
                                                      
                                                    
                                                    
                                                    },
                                                    

                                                      
                                                       
                                                    ]
                                            }).then(permission => {
                                              return res.status(200).json({ user, permission,medecin });                                            })
                                            })
                   })
        .catch(err => {res.status(500).json({ erreur: err.message });});
 
        
    },

  /*
  RECUPERATION D'UN SEUL PATIENT AVEC LES INFOS ET LES COMPTES RENDUS
     PATIENT/ req.body.identifiant: 2021silogik1160
     MEDECIN / =req.body.idMedecin :1
  */
  getinfoPatient(req, res) {
    const idPatient = req.body.identifiant;
    const idMedecin = req.body.idMedecin;
    if (idPatient != null && idMedecin != null) {
      User.findOne({
        where: {
          identifiant: idPatient
        },
      }).then(user => {
        Patient.findOne({
          where: {
            idUtilisateur: user.idUtilisateur
          }//patient
        }).then(patient => {
          Permission.findAll({
            where: {
              idPatient: patient.idPatient,
              idMedecin: idMedecin,
              permission: true
            },
            include: [{
              model: CCR, as: 'compterendu',
            }
            ]
          }).then(compterendu => {
            //HISTORIQUE ACTIVITE ET HISTORIQUEMEDECIN
           
            const nomActivite = 'consultation';
            Activite.findOne({
              where: {
                nomActivite: nomActivite
              }
            }).then(activite => {
              Medecin.findOne({
                where: {
                  idMedecin: idMedecin
                },
                include: [{
                  model: User,
                  as: 'user'
                }


                ]
              }).then(users => {

                Historique.create({
                  idActivite: activite.idActivite,
                  dateHistorique: new Date(),
                  idUtilisateur: users.user.idUtilisateur, 
                  message: 'le medecin ' + users.user.nom + ' a constulter le doosier  du patient ' + user.identifiant
                }).then(historique => {
                  Historiquemedecin.create({
                    idHistorique: historique.idHistorique
                  }).then(hstmed => {

                    return res.status(200).json({ message: 'medecin with compte rendu and patients', data: { compterendu: compterendu, user: user, historique, hstmed, users } });
                  })
                })
              })
            })




          }).catch(err => {
            res.status(500).send("Fail! Error -> " + err);
          })
        }).catch(err => {
          res.status(500).send("Fail! Error -> " + err);
        })
      }).catch(err => {
        res.status(500).send("Fail! Error -> " + err);
      })
    } else {
      return res.status(400).json({ message: 'user not found data' })

    }

  },

  /*
        RECUPERATION DES INFOS DU MEDECIN (MEDECIN CONNECTE)
        AVEC SON IDENTIFIANT
        "identifiant": "2021silogik1150"
  */
  getInfoMedecin(req, res) {
    if (req.body.identifiant) {
      const idMedecin = req.body.identifiant;
      User.findOne({
        where: {
          identifiant: idMedecin

        },
        include: [{
          model: Medecin, as: 'medecin'
        },
        {
          model: Notification, as: 'notification'
        }]
      }).then(medecin => {
        if (medecin) {
          return res.status(200).json({ message: 'medecin information and data', medecin: medecin })

        } else {
          return res.status(400).json({ message: 'not found data' })

        }
      }).catch(err => {
        res.status(500).send("Fail! Error -> " + err);
      })
    } else {
      return res.status(400).json({ message: 'user not found data' })
    }

  },

  ProfileMedecin(req, res) {
    if (req.body.identifiant) {
        User.findOne({
            where: {
                identifiant: req.body.identifiant
            },
            attributes :['idUtilisateur','identifiant', 'nom','prenom', 'adresse','telephone','email']
        }).then(user => {
            if (user) {
                Medecin.findOne({
                    where : {
                        idUtilisateur : user.idUtilisateur
                    },
                     attributes :['idMedecin', 'specialite']
                }).then(medecin =>{
                  if(medecin)
                   { return res.status(200).json({ message: 'Information medecin : ',user,medecin })}
                   else{
                    return res.status(400).json({ message: ' ce n est pas un medecin ' })
                   }
                }).catch(err => {res.status(500).json({ erreur: err.message });});
            } else {
                return res.status(400).json({ message: 'utilisateur n existe pas ' })
            }
        }).catch(err => {
            res.status(500).send("Fail! Error -> " + err);
        })
    } else {
        return res.status(400).json({ message: 'identifiant require' })
    }
  },

  getListeCRRMedecin(req,res){

    if(!req.body.identifiant){
            res.status(500).json({message : 'identifiant require'});
   }


         const { page, size, numDossier, nomPatient, dateDebut, dateFin} = req.body;
         let colonne = req.body.colonne;
         let ordre = req.body.ordre;
         console.log(colonne);
         console.log(ordre);
      
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
     


         if(dateDebut && dateFin )
       {   
            conditio = { dateCreation :  { [Op.between] : [ dateDebut, dateFin ] }}
    
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
             Medecin.findOne({
                 where : {
                     idUtilisateur : user.idUtilisateur
                 }
             }).then(medecin =>{
                 if(!medecin){
                     res.status(200).json({message : 'medecin not found'});
                 }
                                Permission.findAndCountAll({
                                

                                     where : {
                                         idMedecin : medecin.idMedecin,
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
                                                            model:Patient,
                                                            as:'patient',
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



// getListeCRRMedecin(req, res){
//   User.findOne({
//     where: {
//       identifiant: req.body.identifiant
//       }
//   }).then(user =>{
//     if(!user){
//       res.status(200).json({message : 'user not found'});
//   }
//   Medecin.findOne({
//     where : { idUtilisateur : user.idUtilisateur}
//   }).then(medecin => {
//     if(!medecin){
//       res.status(200).json({message : 'medecin not found'});
//   } 
//   Permission.findAndCountAll({
//      where : {
//         idMedecin : medecin.idMedecin,
//    },
  
//     include: [
//                                {
//                            model:CCR,
//                            as:'compterendu',
//                                    where : 
//                                 {   [Op.and] : [ conditio,
//                                                condition,
//                                            ]},
//                                  },
//                            {
//                            model:Patient,
//                            as:'patient',
                         
//                                                            include :[
//                                                                {
//                                                                    model : User,
//                                                                    as : 'user',
//                                                                    where :  con,
                                                                 
//                                                                    attributes : ['nom', 'prenom', 'telephone'],
//                                                                    required: true
                                                                 
//                                                                }      ]
//                                     }
// ],

//  limit, offset
// })





//   }).catch(err => {res.status(500).json({ erreur: err.message });});
//   }).catch(err => {res.status(500).json({ erreur: err.message });});
// },

  
}





