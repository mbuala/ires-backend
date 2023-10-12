const User = require('../models').Utilisateur;
const Patient = require('../models').Patient;
const Medecin = require('../models').Medecin;
const Userlabo = require('../models').Userlabo;
const Adminsilogik = require('../models').Adminsilogik;
const Adminlabo = require('../models').Adminlabo;
const Role = require('../models').Role;
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const num = require('./functionnality');
const authJwt = require("../middleware/authJwt");
const Envoie = require("./EmailController");
const Reclamation = require('../models').Reclamation;
var fileExtension = require('file-extension')
const multer = require('multer');
const fs = require("fs");
const csv = require("fast-csv");
const Op = Sequelize.Op;
const CsvParser = require("json2csv").Parser;
const readXlsxFile = require('read-excel-file/node');
var dateFormat = require('dateformat');
const sleep = require('sleep-promise');
function generateUsername(firstname, surname) {
    let Fname = firstname.charAt(0)
    let Flastname = surname.charAt(0)
    let full = Fname+Flastname
    
    return full;
}
function importExcelData2SQL(filePath){ 
        var user={}
	readXlsxFile(filePath).then((rows) => {		
 	user =JSON.stringify(rows)
        console.table(user)
         
	}) 
 
    


}
    
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
  function  getIdentifiant (nom)  {
    var day2=dateFormat(new Date(), "ddmmyyhhmmss");
    const day = new Date();
    var num = Math.floor((Math.random() * 1000000));
    const numdossier =nom+day2;
    return numdossier;
};

module.exports = {

    //afficher les roles 
    listRole(req, res) {
        return Role.findAll({
            include: [{
                model: User,
                as: 'users',

            }],
        }).then((role) => {
            if (!role) {
                return res.status(404).send({
                    error: 'reclamation Not Found',
                });
            }
            return res.status(200).send(role);
        })
            .catch((error) => res.status(400).send(error));
    },



    // ajout d'un patient
    addPatient(req, res) {
        /*
       ICI ON FAIT LE TEST PAR RAPPORT AU ROL RECUPERER ENFIN D'AVOIR LA CLE PRIMAIRE
        */
        const role = 'patient'
        Role.findOne({
            where: {
                role: role
            }
        }).then((role) => {
            const userData = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                nomComplet : req.body.nom +' '+ req.body.prenom,
                sexe: req.body.sexe,
                dateNaissance: req.body.dateNaissance,
                telephone: req.body.telephone,
                identifiant: num.getIdentifiant(req.body.identifiant),
                email: req.body.email,
                adresse: req.body.adresse,
                etatCivil: req.body.etatCivil,
                ville : req.body.ville,
                cin: req.body.cin,
                idRole: role.idRole,
            }

            User.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(user => {
                    if (!user) {
                        var motDePasse = Math.random().toString(36).slice(-8);
                        /*
                            ENREGISTREMENT D'UN USER DANS LA BDD
                        */
                        console.log("***********password**************>>>: " + motDePasse)
                        bcrypt.hash(motDePasse, 10, (err, hash) => {
                            userData.motDePasse = hash
                            User.create(userData)
                                .then(user => {

                                    // envoie Email  user.idUtilisateur  motDePasse non crypté url 

                                    Envoie.EnvoiEmail(user.email, null, res, userData.identifiant, motDePasse);





                                    // CREATION DU PATIENT

                                    Patient.create({
                                        idUtilisateur: user.idUtilisateur,
                                        ipp: req.body.ipp,

                                    })
                                    num.setHistorique(req.body.userLabo, 'création', 'création d\'un nouveau compte patient ' + user.identifiant)
                                    res.status(200).json({ message: 'patient ajouté avec succès', user: user, motDePasse })
                                })
                                .catch(err => {
                                    res.send('error: ' + err)
                                })
                        })
                    }
                    else {
                        res.json({ error: "User already exists", error })
                    }
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
        })

    },


    /*
    AJOUT DES MEDECINS
    */
    addMedecin(req, res) {
        const role = 'medecin'
        Role.findOne({
            where: {
                role: role
            }
        }).then((role) => {

            const userData = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                nomComplet : req.body.nom +' '+ req.body.prenom,
                sexe: req.body.sexe,
                ville: req.body.ville,
                telephone: req.body.telephone,
                identifiant: num.getIdentifiant(req.body.identifiant),
                email: req.body.email,
                adresse: req.body.adresse,
                
                cin: req.body.cin,
                idRole: role.idRole,
            }

            User.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(user => {
                    if (!user) {
                        var motDePasse = Math.random().toString(36).slice(-8);
                        /*
                            ENREGISTREMENT D'UN USER DANS LA BDD
                        */
                        console.log("***********password**************>>>: " + motDePasse)
                        
                        bcrypt.hash(motDePasse, 10, (err, hash) => {
                            userData.motDePasse = hash
                            console.log( "ups" + hash)
                            console.log( "upddds" + userData.motDePasse)
                            User.create(userData)
                                .then(user => {
                                    /*
                                        ENVOIE DU MAIL 
                                        user.idUtilisateur
                                        motDePasse non crypté
                                        url  
                                    /*
                                  
                                        CREATION DU MEDECIN
                                    */
                                    Envoie.EnvoiEmail(user.email, null, res, userData.identifiant, motDePasse);
                                    Medecin.create({

                                        specialite: req.body.specialite,
                                        idUtilisateur: user.idUtilisateur,


                                    }).then((medecin) => {
                                        if (!medecin) {
                                            return res.status(404).send({
                                                error: 'medecin Not Found',
                                            });
                                        }
                                        num.setHistorique(req.body.userLabo, 'création', 'création du nouveau compte medecin ' + user.identifiant)

                                        res.status(200).json({ message: 'medecin ajouté avec succès', user: user, motDePasse })
                                    })
                                        .catch((error) => res.status(400).send(error));
                                    //  res.status(200).send(user)
                                })
                                .catch(err => {
                                    res.send('error: ' + err)
                                })
                        })
                    }
                    else {
                        res.json({ error: "User already exists" })
                    }
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
        })
    },

    // ajout d'un user labo
    addUserLabo(req, res) {
        const role = 'userLabo'
        Role.findOne({
            where: {
                role: role
            }
        }).then((role) => {

            const userData = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                nomComplet : req.body.nom +' '+ req.body.prenom,
                sexe: req.body.sexe,
                dateNaissance: req.body.dateNaissance,
                telephone: req.body.telephone,
                identifiant: num.getIdentifiant(req.body.identifiant),
                email: req.body.email,
                adresse: req.body.adresse,
                etatCivil: req.body.etatCivil,
                cin: req.body.cin,
                idRole: role.idRole,
            }

            User.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(user => {
                    if (!user) {
                        var motDePasse = Math.random().toString(36).slice(-8);
                        /*
                            ENREGISTREMENT D'UN USER DANS LA BDD
                        */
                        console.log("***********password**************>>>: " + motDePasse)
                        bcrypt.hash(motDePasse, 10, (err, hash) => {
                            userData.motDePasse = hash
                            User.create(userData)
                                .then(user => {
                                    /*
                                        ENVOIE DU MAIL 
                                        user.idUtilisateur
                                        motDePasse non crypté
                                        url  
                                    /*
                                        CREATION DU MEDECIN
                                    */
                                    Envoie.EnvoiEmail(user.email, null, res, userData.identifiant, motDePasse);
                                    Userlabo.create({

                                        service: req.body.service,
                                        idUtilisateur: user.idUtilisateur,


                                    }).then((userlabo) => {
                                        if (!userlabo) {
                                            return res.status(404).send({
                                                error: 'erreur',
                                            });
                                        }
                                        num.setHistorique(req.body.userLabo, 'création', 'création d\'un nouveau utilisateur labo ' + user.identifiant)

                                        res.status(200).json({ message: 'user labo ajouté avec succès', user: user, motDePasse })
                                    })
                                        .catch((error) => res.status(400).send(error));
                                    //  res.status(200).send(user)
                                })
                                .catch(err => {
                                    res.send('error: ' + err)
                                })
                        })
                    }
                    else {
                        res.json({ error: "User already exists" })
                    }
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
        })
    },

    // ajout d'un admin Silogik
    addAdminSilogik(req, res) {
        const role = 'adminSilogik'
        Role.findOne({
            where: {
                role: role
            }
        }).then((role) => {

            const userData = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                nomComplet : req.body.nom +' '+ req.body.prenom,
                sexe: req.body.sexe,
                dateNaissance: req.body.dateNaissance,
                telephone: req.body.telephone,
                identifiant: num.getIdentifiant(req.body.identifiant),
                email: req.body.email,
                adresse: req.body.adresse,
                etatCivil: req.body.etatCivil,
                cin: req.body.cin,
                idRole: role.idRole,
            }

            User.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(user => {
                    if (!user) {
                        var motDePasse = Math.random().toString(36).slice(-8);
                        /*
                            ENREGISTREMENT D'UN USER DANS LA BDD
                        */
                        console.log("***********password**************>>>: " + motDePasse)
                        bcrypt.hash(motDePasse, 10, (err, hash) => {
                            userData.motDePasse = hash
                            User.create(userData)
                                .then(user => {
                                    /*
                                        ENVOIE DU MAIL 
                                        user.idUtilisateur
                                        motDePasse non crypté
                                        url  
                                    /*
                                        CREATION DU MEDECIN
                                    */
                                    Envoie.EnvoiEmail(user.email, null, res, userData.identifiant, motDePasse);
                                    Adminsilogik.create({


                                        idUtilisateur: user.idUtilisateur,


                                    }).then((adminsilogik) => {
                                        if (!adminsilogik) {
                                            return res.status(404).send({
                                                error: 'erreur de creation',
                                            });
                                        }
                                        num.setHistorique(req.body.userLabo, 'création', 'création d\'un nouveau compte Admin Silogik' + user.identifiant)

                                        res.status(200).json({ message: 'admin silogik estt ajouté avec succès', user: user, motDePasse })
                                    })
                                        .catch((error) => res.status(400).send(error));
                                    //  res.status(200).send(user)
                                })
                                .catch(err => {
                                    res.send('error: ' + err)
                                })
                        })
                    }
                    else {
                        res.json({ error: "User already exists" })
                    }
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
        })
    },

    // ajout d'un admin labo

    addAdminLabo(req, res) {
        const role = 'labo'
        Role.findOne({
            where: {
                role: role
            }
        }).then((role) => {

            const userData = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                nomComplet : req.body.nom +' '+ req.body.prenom,
                sexe: req.body.sexe,
                dateNaissance: req.body.dateNaissance,
                telephone: req.body.telephone,
                identifiant: num.getIdentifiant(req.body.identifiant),
                email: req.body.email,
                adresse: req.body.adresse,
                etatCivil: req.body.etatCivil,
                cin: req.body.cin,
                idRole: role.idRole,
            }

            User.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(user => {
                    if (!user) {
                        var motDePasse = Math.random().toString(36).slice(-8);
                        /*
                            ENREGISTREMENT D'UN USER DANS LA BDD
                        */
                        console.log("***********password**************>>>: " + motDePasse)
                        bcrypt.hash(motDePasse, 10, (err, hash) => {
                            userData.motDePasse = hash
                            User.create(userData)
                                .then(user => {
                                    /*
                                        ENVOIE DU MAIL 
                                        user.idUtilisateur
                                        motDePasse non crypté
                                        url  
                                    /*
                                        CREATION DU MEDECIN
                                    */
                                    Envoie.EnvoiEmail(user.email, null, res, userData.identifiant, motDePasse);
                                    Adminlabo.create({


                                        idUtilisateur: user.idUtilisateur,


                                    }).then((adminsilogik) => {
                                        if (!adminsilogik) {
                                            return res.status(404).send({
                                                error: 'erreur de creation',
                                            });
                                        }
                                        num.setHistorique(req.body.userLabo, 'création', 'création d\'un nouveau compte Admin Labo ' + user.identifiant)

                                        res.status(200).json({ message: 'admin labo ajouté avec succès', user: user, motDePasse })
                                    })
                                        .catch((error) => res.status(400).send(error));
                                    //  res.status(200).send(user)
                                })
                                .catch(err => {
                                    res.send('error: ' + err)
                                })
                        })
                    }
                    else {
                        res.json({ error: "User already exists" })
                    }
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
        })
    },

    addReclamation(req, res) {

        if (!req.body.message) {
            res.status(200).json({ message: 'message require' });
        }
        User.findOne({
            where: {
                identifiant: req.body.identifiant
            },
        }).then(user => {


            if (!user) {
                return res.status(200).json({ message: 'user not found' });
            }

            const reclamation = {
                message: req.body.message,
                idUtilisateur: user.idUtilisateur,
                date: new Date()

            }

            Reclamation.create(reclamation).then(reclamation => {
                res.status(200).json({ message: 'reclamation ajoutée' });
            }).catch(err => {
                res.send('error: ' + err)
            })


        }).catch(err => {
            res.send('error: ' + err)
        })




    },


    // getListeReclamation(req, res) {
    //     Reclamation.findAll({
    //         order: [
    //             ['createdAt', 'DESC'],

    //         ],
    //         attributes: {
    //             exclude: ['idUtilisateur', 'updatedAt', 'date']
    //         },
    //         include: [{
    //             model: User,
    //             as: 'user',

    //             include: [{
    //                 model: Role,
    //                 as: 'role',
    //                 attributes: ['role']
    //             }],
    //             attributes: ['nom', 'prenom']
    //         }]
    //     }).then(reclamation => {
    //         if (!reclamation) {

    //             res.status(200).json({ message: 'pas de reclamations' });
    //         }
    //         res.send(reclamation)
    //     }).catch(err => {
    //         res.send('error: ' + err)
    //     })
    // },




    searchreclamation(req, res) {
        Reclamation.findAll({
            where: {
                date: req.body.date
            },
            include: [{
                model: User,
                as: 'user',

                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['role']
                }],
                attributes: ['nom', 'prenom']
            }]
        }).then(reclamation => {
            res.send(reclamation)

        })
    },
    async getOneUser(req, res) {
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                return res.status(200).send(true);
            } else {
                return res.status(200).send(false);

            }


        }).catch(err => {
            res.send('error: ' + err)
        })

    },

    medecinFile : async (req, res) => {
        const filePath = req.file;
        const customers = [];
        const emails = [];
        const existEmail = [];
         if(req.file == undefined)
         {
            return res.status(400).send({message: "Please upload a CSV file!"});
         }
         else 
         {
           // lire le fichier
            
           let rows = await readXlsxFile(filePath.path)
        
                rows.shift();
                let length = rows.length;
               
                for(let i=0; i<length; i++)
                { 
                    await sleep(1000);
                   
                    let customer = 
                    {
                        nom: rows[i][0],
                        prenom: rows[i][1],
                        nomComplet: rows[i][0] + ' ' + rows[i][1],
                        email: rows[i][2],
                        ville: rows[i][3],
                        identifiant: num.getIdentifiant(generateUsername(rows[i][0], rows[i][1])),
                        motDePasse : Math.random().toString(36).slice(-8),
                        idRole:5,
                        adresse: rows[i][4],
                        telephone: rows[i][5],
                        cin: rows[i][6],
                        sexe: rows[i][7],                           
                    }    
              
                   
                   await User.findOne({
                        where :
                         {
                            [Op.or]: [
                                { email : customer.email },
                                { identifiant : customer.identifiant }
                              ]
                                 
                         }
                    })
                    .then(function(user){
                   if(user){
                    existEmail.push(user)
                     }
                    else{
                        customers.push(customer);
                        // console.log("existe pas")
                        let mdp = customer.motDePasse
                        // console.log('efeg ' + mdp) 
                        bcrypt.hash(customer.motDePasse, 10, (err, hash) => {
                            customer.motDePasse = hash
                            // console.log( "upddds" + customer.motDePasse)
                           
                                User.create(customer).then(medecin => {
                                    Envoie.EnvoiEmail(customer.email, null, res, customer.identifiant, mdp);
                                    Medecin.create({
                                        specialite : customer.specialite,
                                        idUtilisateur : medecin.idUtilisateur
                                    }).then(meed =>
                                        {
                                        
                                            if(meed){
                                                Envoie.EnvoiEmail(customer.email, null, res, customer.identifiant, mdp);
            
                                            }
                                        })
            
                                   })
                            
                           

                        })
                       
                    }
                  
                    })
                    .catch(err => {res.status(500).json({ erreur: err.message });});
              }
              
            res.status(200).json(existEmail);
         }
    },
    getListeReclamationpagination(req, res) {


      const { page, size, role,  date, colonne, ordre} = req.body;
      var condition = role ? { role: { [Op.like]: `${role}` } } : null;
      var condition1 = date? { date : { [Op.eq]: `${date}` }} : null;
      console.log(page);
      console.log(size);
      const { limit, offset } = getPagination(page, size);

       Reclamation.findAndCountAll({
       where : condition1,
       order : [[colonne, ordre]],
        include : [
               {
                   model : User,
                   as : 'user',
                   attributes : ['nom', 'prenom','nomComplet','idRole'],
                   required: true,
                   include : [
                       {
                           model :Role,
                           as : 'role',
                           attributes : ['role'],
                           where : condition,
                           

                       }
                   ]
                   
               }
           ],
           limit, offset
       })
       .then(reclamations =>{
        if (!reclamations) {

            res.status(200).json({ message: 'pas de reclamations' });
        }
        else{
            const response = getPagingData(reclamations, page, limit);
            res.status(200).json({ response});
        }
       })
       .catch(err => { res.status(500).json({ erreur: err.message }); });

   },









}