import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
     'Content-Type': 'application/json',
   // 'Access-Control-Allow-Origin':'http://localhost:8081'
    })
};
const baseUrl = environment.backendServer
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
   //authentification
  login(identifiant, password): Observable<any> {
    return this.http.post( baseUrl + 'auth' , {
      identifiant: identifiant,
      password: password
    }, httpOptions);
  }
  // recuperer mdp avec email
  emailReset(credentials): Observable<any> {
    return this.http.post(baseUrl + 'forgotPassword' , {
      email : credentials.email
      
    }, httpOptions);
  }
   // changer mot de passe(avec lien de réinitialisation)
  changepassword(resettoken: any, password: string): Observable<any> {
   return this.http.post(baseUrl + 'resetPassword' , {
      resettoken : resettoken,
      password : password
   }, httpOptions);
  }
    // changer mot de passe dans le profil(patient, medecin, labo)
  updatepassword(identifiant: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(baseUrl + 'patient/updatePassword' , {
     identifiant : identifiant,
      oldPassword : oldPassword,
      newPassword : newPassword
   }, httpOptions);
  }
  // pour chaque patient recuperer la liste des CRR avec une pagination coté serveur et filtre de recherche et ordre
  getAllCrroagination(params, identifiant, colonne, ordre ): Observable<any> {
    return this.http.post(baseUrl + 'patient/getListeCrrPagination' , {
     identifiant : identifiant,
     numDossier : params.numDossier,
     nomMedecin : params.nomMedecin,
    dateDebut : params.dateDebut,
    dateFin : params.dateFin,
     size : params.size,
     page : params.page,
     colonne : colonne,
     ordre : ordre ,
  }, httpOptions);
  }
  // pour chaque medecin recuperer les CRR de ses patients avec pagination et filtre de rechrche coté serveur
  getAllCrroaginationMedecin(params, identifiant, colonne, ordre ): Observable<any> {
    return this.http.post(baseUrl + 'medecin/getListeCRRMedecin' , {
     identifiant : identifiant,
     numDossier : params.numDossier,
     nomPatient : params.nomPatient,
    dateDebut : params.dateDebut,
    dateFin : params.dateFin,
     size : params.size,
     page : params.page,
     colonne : colonne,
     ordre : ordre ,
  }, httpOptions);
  }
 // patient change la visibilité du crr
  visibilite(idMedecin, idPatient, idCRR , permission): Observable<any> {
   return this.http.post( baseUrl + 'patient/accordpermissionMedecin' , {
     idMedecin : idMedecin,
      idPatient : idPatient,
      idCRR : idCRR,
      permission : permission,
   }, httpOptions);
  }
  // recuperer la liste des medecins d un patient avec pagination et filtre de recherche coté serveur
  getAllMedecinsPatient(params, nomMedecin : string , specialite :  string, identifiant,  colonne, ordre ): Observable<any> {
    return this.http.post( baseUrl + 'patient/getListeMedecinsPagination' , {
     identifiant : identifiant,
     nomMedecin : nomMedecin,
     specialite : specialite,
     size : params.size,
     page : params.page,
     colonne : colonne,
     ordre : ordre,
    }, httpOptions);
    }
   // envoyer une reclamation au labo(patient et medecin)
  contact(identifiant, message): Observable<any> {
  return this.http.post(baseUrl + 'reclamation/addReclamation' , {
    identifiant: identifiant,
   message : message,
   }, httpOptions);
  }
  // recupere la liste des patients d'un medecin avec pagination et filtre de rechrche coté serveur
  getAllPatientMedecin(params, identifiant): Observable<any> {
    return this.http.post(baseUrl + 'medecin/listePatientMedecin' , {
     identifiant : identifiant,
    nomPatient : params.nomPatient,
     numDossier : params.numDossier,
      size : params.size,
     page : params.page
   }, httpOptions);
  }
  // recuperer les CRR d'un patient pour un medecin avec pagination et filtre de rechrche coté serveur
  getCrrPatientMedecin(param, identifiant , idPatient): Observable<any> {
    return this.http.post(baseUrl + 'medecin/listeCrrPatient' , {
      identifiant : identifiant,
     idPatient : idPatient,
     numDossier : param.numDossierCRR1,
     dateDebut : param.dateDebut,
     dateFin : param.dateFin,
     page : param.page1,
     size : param.size1
 }, httpOptions);
  }
  // visualisation du crr par le patient
    voirCRRPatient(idCRR): Observable<any> {
    return this.http.post(baseUrl + 'CrrPatient' , {
      idCRR : idCRR,
    }, httpOptions);
  }
  // visualisation du crr par le medecin
  voirCRRMedecin(idCRR): Observable<any> {
    return this.http.post(baseUrl + 'CrrMedecin' , {
      idCRR : idCRR,
    }, httpOptions);
  }
  // changer le mot de passe si c la premiere authentification 
  changeMdpFirstLogin(identifiant, nvpassword): Observable<any> {
   return this.http.post(baseUrl + 'changepassword' , {
      identifiant: identifiant,
      motDePasse : nvpassword
   }, httpOptions);
  }
  // recuperer les informations profil du patient
  profilePatient(identifiant): Observable<any> {
   return this.http.post(baseUrl + 'PofilePatient' , {
      identifiant: identifiant,
    }, httpOptions);
  }
  // recuperer les informations profil du medecin
  profileMedecin(identifiant): Observable<any> {
  return this.http.post(baseUrl + 'PofileMedecin' , {
      identifiant: identifiant,
     }, httpOptions);
  }
}
