const config = require("../config/auth.config");
const User = require('../models').Utilisateur;
const Role = require('../models').Role;
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");

const Envoie = require("./EmailController");


module.exports = {
  // envoyer le lien de réinitialisation dans gmail
  forgotPassword(req, res) {
    //tester si l'email est saisi
    if (!req.body.email) {
      return res
        .status(500)
        .json({ message: 'Email requis' });
    }

    User.findOne({
      where: {
        email: req.body.email
      }
    })


      .then(user => {

        if (!user) {
          return res.status(404).send({ message: "Adresse mail introuvable." });
        }


        var token = jwt.sign({ id: user.idUtilisateur }, config.secretreset, {
          expiresIn: '40m' // 24 hours

        });




        user.update({ resettoken: token });



        Envoie.EnvoiEmail(user.email, token, res, null, null);











      }).catch(err => {
        res.status(500).send({ message: err.message });
      });






  },


  //modifier le password
  resetPassword(req, res){
    if(!req.body.password){
      return res.status(404).send({ message: "Password Requis" });
    }
          const resettoken = req.body.resettoken;
    
          if(resettoken){
    
    jwt.verify(resettoken, config.secretreset, (err, decodedData) => {
     if (err) {
       return res.status(401).send({
         message: "incorrect token or it is expired"
       });
     }
     //req.id = decoded.id;
    
    
    
     User.findOne({
       where: {
         resettoken: req.body.resettoken
       }
     })
       .then(user => {
         if (!user) {
           return res.status(404).send({ message: "User Not found." });
         }
    
       user.update({motDePasse : bcrypt.hashSync(req.body.password, 8)}).then(() => 
       res.status(200).json({message: 'Votre mot de passe est changé'}));
    
    
    })
    })
    
    }else{
     return res.status(401).send({ error: "erreur dans la réinitialisation ." });
    
    }
    
      }

}