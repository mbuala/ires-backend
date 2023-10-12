const config = require("../config/auth.config");
const User = require('../models').Utilisateur;
const Role = require('../models').Role;
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

var message = '';
var subject = '';

exports.EnvoiEmail = (email, token, res, identiffiant, password) => {

    if (token) {
        subject = 'réinitialisation de mot de passe'
        message =' Bonjour, Nous avons reçu une demande de réinitialisation de votre mot de passe Ires \n\n' +
        'Vous pouvez changer directement votre mot de passe sur le lien suivant:\n\n' +
        'http://localhost:4200/#/resetpassword/' + token + '\n\n' 
            }
    else {
        subject = 'Identifiants'
        message = 'Votre identifiant est ' + identiffiant + '\n' +
            'Votre mot de passe est ' + password + '\n'
    }
    var transporter = nodemailer.createTransport({
        host: 'aboutouil.silogik@gmail.com',
        service: 'gmail',
        port: 465,
        auth: {
            user: 'aboutouil.silogik@gmail.com',
            pass: 'azerty123+'
        }
    });

    var mailOptions = {
        to: email,
        from: 'aboutouil.silogik@gmail.com',
        subject: subject,
        text: message
    }

    transporter.sendMail(mailOptions, (err, info) => {

        if (err) {
            console.log("probleme: %s", err);

        }
        else {
            res.status(200).send({ message: ' email envoyé' });
            console.log(info);


        }


    })


};