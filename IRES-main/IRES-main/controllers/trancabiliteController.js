const User = require('../models').Utilisateur;
const Activite = require('../models').Activite;
const Historique = require('../models').Historique;
const HistoriquePatient = require('../models').HistoriquePatient;
const HistoriqueMedecin = require('../models').HistoriqueMedecin;



module.exports = {
    getTracabilite(req, res) {
        User.findOne({
            
            where: {
                identifiant: req.body.identifiant,
                
            },
            
        }).then(user => {
            if (req.body.date==null) {
                Historique.findAll({
                    order: [
                        ['createdAt', 'DESC'],
                           
                     ],
                    where: {
                        idUtilisateur: user.idUtilisateur,
                       
                    },
                    include: [
                        {
                            model: Activite,
                            as: 'activite',
                            attributes: ['nomActivite'],
                           
                        }
                    ]
                }).then(historique => {
                    return res.status(200).json({ messsage: 'success', historique })
                })
            } else {
                Historique.findAll({
                    order: [
                        ['createdAt', 'DESC'],
                           
                     ],
                    where: {
                        idUtilisateur: user.idUtilisateur,
                        dateHistorique:req.body.date
                    },
                    include: [
                        {
                            model: Activite,
                            as: 'activite',
                            attributes: ['nomActivite'],
                           
                        }
                    ]
                }).then(historique => {
                    return res.status(200).json({ messsage: 'success', historique })
                })
            }
            
        })


    },
}