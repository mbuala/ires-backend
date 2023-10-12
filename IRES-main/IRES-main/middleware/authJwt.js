const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require('../models').Utilisateur;
const Role = require('../models').Role;
const UserController = require('../controllers/userController');



// verifier si le token est valable
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];// recuperer le token de l'entete

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Non autorisé"
      });
    }
    req.id = decoded.id;

    next();
  });


};

// tester si c'est un admin silogik
isAdminSilogik = (req, res, next) => {
  User.findByPk(req.id)
    .then(user => {
      // role.findByPk(user.idRole).then
      Role.findByPk(user.idRole).then(roles => {
        var r = roles.role;
        console.log(r);
        if (r === "adminSilogik") {

          next();
          return;

          // return controller.laboBoard
        }
        else {

          res.status(400).send({
            message: "Require admin silogik Role!"
          });
        }

      });
    })

};



// tester si c'est un ADMIN Labo
isAdminLabo = (req, res, next) => {
  User.findByPk(req.id)
    .then(user => {
      // role.findByPk(user.idRole).then
      console.log("salam" + user.idRole);
      Role.findByPk(user.idRole).then(roles => {
        var r = roles.role;
        console.log(r);
        if (r === "labo") {

          next();
          return;



        }
        else {

          res.status(400).send({
            message: "Require admin labo Role!"
          });
        }

      });
    })

};

// tester si c'est un user labo
isUserLabo = (req, res, next) => {
  User.findByPk(req.id)
    .then(user => {
      // role.findByPk(user.idRole).then
      console.log("salam" + user.idRole);
      Role.findByPk(user.idRole).then(roles => {
        var r = roles.role;
        console.log(r);
        if (r === "userLabo") {

          next();
          return

        }


        res.status(400).send({
          message: "Require user labo Role!"
        });
      });
    })

};

// tester si c'est un patient
isPatient = (req, res, next) => {
  User.findByPk(req.id)
    .then(user => {
      // role.findByPk(user.idRole).then
      console.log("salam" + user.idRole);
      Role.findByPk(user.idRole).then(roles => {
        var r = roles.role;
        console.log(r);
        if (r === "patient") {
          next();
          return;


          //  return;
        }


        res.status(200).send({
          message: "Require patient Role!"
        });

      });
    })

};

// tester si c'est un medecin 

isMedecin = (req, res, next) => {
  User.findByPk(req.id)
    .then(user => {
      // role.findByPk(user.idRole).then
      console.log("salam" + user.idRole);
      Role.findByPk(user.idRole).then(roles => {
        var r = roles.role;
        console.log(r);
        if (r === "medecin") {

          next();
          return;




        }

        res.status(200).send({
          message: "Require medecin Role!"
        });

      });
    })

};


const authJwt = {
  verifyToken: verifyToken,
  isAdminSilogik: isAdminSilogik,
  isAdminLabo: isAdminLabo,
  isUserLabo: isUserLabo,
  isPatient: isPatient,
  isMedecin: isMedecin

};


module.exports = authJwt;

