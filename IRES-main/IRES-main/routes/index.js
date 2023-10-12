var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController');
const authController = require('../controllers/authController');
const resetpasswordController = require('../controllers/resetpasswordController');
const authJwt = require("../middleware/authJwt");
const MedecinController = require('../controllers/medecinController');
const PatientController = require('../controllers/patientController');
const notification = require('../controllers/notification');
const medecinController = require('../controllers/medecinController');
const permissionController = require('../controllers/permissionController');
const laboController = require('../controllers/laboController');
const trancabiliteController = require('../controllers/trancabiliteController');
const userController = require('../controllers/userController');
const uploadFile=require('../middleware/upload')
var cors = require('cors')
/* GET home page. */

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}




  router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      '"x-access-token, Origin, Content-Type, Accept"'
    );
    next();
  });


// router.get('/', cors(corsOptions), function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
//   res.setHeader('Access-Control-Allow-Credentials', true); // If needed
//   // res.render('index', { title: 'Express' });
// });


//reclamation controller

//router.get('/api/ires/reclamation', ReclamationController.list);

////////////////// aJouter des utilisateurs
// ajouter un patient
router.get('/api/ires', function (req, res, next) {
  res.status(200).json({message:'ir es box api', data:req.headers})

});
router.post('/send-notification',   notification.sendNotification);

router.post('/api/ires/addPatient', [authJwt.verifyToken],  UserController.addPatient);
// ajouter un medecin
router.post('/api/ires/addMedecin',  [authJwt.verifyToken],  UserController.addMedecin);
// ajouter un user labo
router.post('/api/ires/addUserLabo', [authJwt.verifyToken],  UserController.addUserLabo);
// ajouter un admin silogik
router.post('/api/ires/addAdminSilogik', [authJwt.verifyToken],  UserController.addAdminSilogik);
//  ajouter un admin labo
router.post('/api/ires/addAdminLabo',[authJwt.verifyToken],  UserController.addAdminLabo);


router.put('/api/ires/patient/updateData/:identifiant',[authJwt.verifyToken], PatientController.updatePatient)
router.get('/api/ires/listrole',[authJwt.verifyToken], UserController.listRole);



//router.post('/api/ires/test', UserController.test);
router.post('/api/ires/patient/updatePassword',[authJwt.verifyToken],  PatientController.updatePassword)
// autehntification
router.post('/api/ires/auth', authController.signin);
// si first login changer password
router.post('/api/ires/changepassword', authController.changepassword);
// forgot password
router.post('/api/ires/forgotPassword', resetpasswordController.forgotPassword);
// reset password
router.post('/api/ires/resetPassword', resetpasswordController.resetPassword);
// ajouter une reclamation
router.post('/api/ires/reclamation/addReclamation/:identifiant',[authJwt.verifyToken], UserController.addReclamation);
// get list reclamation
// router.get('/api/ires/reclamations', UserController.getListeReclamation);
// get liste reclamation avec pagination et filtre de recherche
router.post('/api/ires/Listereclamations', [authJwt.verifyToken], UserController.getListeReclamationpagination);
//LOGOUT  
router.put('/api/ires/logout', authController.LoginOrLogout);





//medecin
router.post('/api/ires/medecin/getListePatient',[authJwt.verifyToken],  MedecinController.getListePatient);
router.post('/api/ires/medecin/getinfoPatient',[authJwt.verifyToken], medecinController.getinfoPatient);
router.post('/api/ires/medecin/getInfoMedecin',[authJwt.verifyToken], medecinController.getInfoMedecin);
router.put('/api/ires/medecin/updateMedecin',[authJwt.verifyToken], medecinController.updateMedecin)
router.put('/api/ires/medecin/updatePasswordMedecin', [authJwt.verifyToken],medecinController.updatePasswordMedecin)


//patient
router.post('/api/ires/patient/getInfoPatient', [authJwt.verifyToken], PatientController.getInfoPatient);



// recuperer les comptes rendu ( coté patient )
router.post('/api/ires/patient/getListeCrr', [authJwt.verifyToken], PatientController.getListeCrr);
// serach Crr (cote patient)
router.get('/api/ires/patient/serchCrr/:identifiant',[authJwt.verifyToken],  PatientController.searchCrr);

//PERMISSION

router.post('/api/ires/patient/accordpermissionMedecin',[authJwt.verifyToken],  permissionController.accordpermissionMedecin);




//LABO




router.get('/api/ires/getAllUsers', [authJwt.verifyToken], laboController.getAlluser);
router.post('/api/ires/infoUser',[authJwt.verifyToken],  laboController.infoUser);
router.post('/api/ires/profileAdmin', [authJwt.verifyToken], laboController.ProfileAdmin);
router.put('/api/ires/updateUser', [authJwt.verifyToken], laboController.updateUser);
router.get('/api/ires/getPatient', [authJwt.verifyToken], laboController.getPatient);
router.get('/api/ires/getMedecin', [authJwt.verifyToken], laboController.getMedecin);
router.post('/api/ires/labo/accordpermissionMedecinLabo',[authJwt.verifyToken],  permissionController.accordpermissionMedecinLabo);


router.post('/api/ires/infoUser', [authJwt.verifyToken], laboController.infoUser); 
router.put('/api/ires/updateUser', [authJwt.verifyToken], laboController.updateUser);
router.get('/api/ires/getPatient', [authJwt.verifyToken], laboController.getPatient);
router.get('/api/ires/getMedecin',[authJwt.verifyToken],  laboController.getMedecin);
router.post('/api/ires/medecin/nom',[authJwt.verifyToken], laboController.getMedecinByName)
//bloquer un compte 
router.put('/api/ires/lockUnlockCount',[authJwt.verifyToken],  laboController.lockUnlockUser);


//TRACABILITE

router.post('/api/ires/getTracabilite',[authJwt.verifyToken], trancabiliteController.getTracabilite);

router.post('/api/ires/userbyemail', [authJwt.verifyToken], UserController.getOneUser);
router.get('/api/ires/countPatient',[authJwt.verifyToken], laboController.countPatient)
router.get('/api/ires/coutnMedecin',[authJwt.verifyToken], laboController.coutnMedecin)
router.get('/api/ires/labo/getCRR',[authJwt.verifyToken], laboController.getCRR)
router.post('/api/ires/labo/getCRRDuJour',[authJwt.verifyToken], laboController.getCRRDuJour)
router.post('/api/ires/labo/getCRRbyDate',[authJwt.verifyToken], laboController.getCRRbyDate)


router.post('/api/ires/getNotification', [authJwt.verifyToken], laboController.getNotification)
router.post('/api/ires/selectDate',[authJwt.verifyToken], laboController.SelectDate)
router.post('/api/ires/getNotificationNonLus',[authJwt.verifyToken], laboController.getNotificationNonLus)
router.post('/api/ires/countnotification',[authJwt.verifyToken], laboController.countnotification)

router.post('/api/ires/setNotification',[authJwt.verifyToken], laboController.setNotification)
router.post('/api/ires/getUserLabo',[authJwt.verifyToken], laboController.getUserLabo)

router.post('/api/ires/searhnotification',[authJwt.verifyToken], laboController.searhnotification)

// get liste CRR avec pagination et recherche 
router.post('/api/ires/patient/getListeCrrPagination',[authJwt.verifyToken], PatientController.getListeCrrPag);
// get liste CRR d'un medecin
router.post('/api/ires/medecin/getListeCRRMedecin',[authJwt.verifyToken],  MedecinController.getListeCRRMedecin);
// get liste Medecins avec pagination
router.post('/api/ires/patient/getListeMedecinsPagination',[authJwt.verifyToken], PatientController.getListeMedecinPagination);
//get liste patients d un medecin
router.post('/api/ires/medecin/listePatientMedecin',[authJwt.verifyToken], PatientController.getListePatientMedcin);
// get liste crr d un patient pour medecin prescripteur
router.post('/api/ires/medecin/listeCrrPatient', [authJwt.verifyToken],  PatientController.getlisteCrrPatientMedecin);
// ajouter une reclamation
router.post('/api/ires/reclamation/addReclamation',[authJwt.verifyToken], UserController.addReclamation);
// Visualiser Compte rendu (patient)
router.post('/api/ires/CrrPatient',[authJwt.verifyToken],  PatientController.VoirCrrPatient);
// Visualiser Compte rendu (medecin)
router.post('/api/ires/CrrMedecin', [authJwt.verifyToken], PatientController.VoirCrrMedecin);
// recupere les informations du patient qui s'est connecté 
router.post('/api/ires/PofilePatient',[authJwt.verifyToken], PatientController.ProfilePatient);
// recuperer les informations du medecin qui s'est connecté
router.post('/api/ires/PofileMedecin', [authJwt.verifyToken], MedecinController.ProfileMedecin);


router.put('/api/ires/retrievePrermission',[authJwt.verifyToken], laboController.retrievePrermission);


router.post('/api/ires/getListeMedecinOfPatient',[authJwt.verifyToken], laboController.getListeMedecinOfPatient)


router.post('/api/ires/searchreclamation',[authJwt.verifyToken], userController.searchreclamation)

//router.post('/api/ires/medecinFile',userController.medecinFile)
router.post('/api/ires/file', uploadFile.single('file'),userController.medecinFile)
module.exports = router;