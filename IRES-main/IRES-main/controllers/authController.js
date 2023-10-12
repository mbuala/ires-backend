const config = require("../config/auth.config");
const User = require('../models').Utilisateur;
const Role = require('../models').Role;
const Session = require('../models').Session;// mod
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const num = require('./functionnality');

module.exports = {



  // authentification
  signin(req, res) {
    if(!req.body.identifiant ||  !req.body.password )
    {
      return res.status(404).send({ message: "Identifiant ou mot de passe requis" });
    }
    User.findOne({
      where: {
        identifiant: req.body.identifiant
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "Utilisateur introuvable ." });
        }
        if(user.isLock){
          return res.status(404).send({ message: "Votre compte est bloqué, Contactez votre laboratoire." });
        }


        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.motDePasse
        );
        console.log(req.body.password);
        console.log(user.motDePasse);
         console.log(passwordIsValid);
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Mot de passe invalide!"
          });
        }


        var token = jwt.sign({ id: user.idUtilisateur }, config.secret, {
          expiresIn: 86400 // 24 hours "60S" or 86400
        });


        // role.findByPk(user.idRole).then
        console.log("salam" + user.idRole);
        Role.findByPk(user.idRole).then(roles => {
          var r = roles.role;
          console.log(r);


          //mod
          Session.create({

            idUtilisateur: user.idUtilisateur,dateDebut:new Date(),statut:true

          })
          num.setHistorique(user.idUtilisateur,'connexion','connexion de l\'utilisateur ');






          ///////////////







          if (!user.isConnected) {
            res.status(200).send({
              user, role: r, token: token
              //envoie du formulaire pour changer le password
            });
          } else {
            //dashboard
            res.status(200).send({
              user, role: r, token: token
              //envoie du formulaire pour changer le password
            });
          }




        });
      })
      .catch(err => {
        var erreur = "Erreur lors de l'authentification "
        console.log(err.message );
        res.status(500).send({ message: erreur});
      });
  },

  // changementpassword(first login) 
  changepassword(req, res) {
    console.log("hello");
    if(!req.body.identifiant || !req.body.motDePasse){
      return res.status(404).send({ message: "Identifiant ou mot de passe requis" });
    }
    User.findOne({
      where: {
        identifiant: req.body.identifiant
      }
    }).then(user => {
if(!user){
  return res.status(404).send({ message: "pas de user" });
}

      user.update({ motDePasse: bcrypt.hashSync(req.body.motDePasse, 8), isConnected: true }).then(() =>
        res.status(200).json({ message: 'Votre mot de passe a été modifié' }));

    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
  },
  //CONNECTION ET DECONNECTION
     LoginOrLogout(req,res){
    try {
      if(req.body.idUtilisateur){
      
        Session.findOne({
          where:{
            idUtilisateur:req.body.idUtilisateur,
            statut:true
          }
        }).then(session=>{
          console.log(session)
           
              session.update({dateFin:new Date(),statut:false});
              res.status(200).json({message:'logout success'})

            
        })
      }
    } catch (error) {
      return res.status(500).json({message:'error=>',error})
    }
  },
  




}