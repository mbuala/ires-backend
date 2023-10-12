import { ErrorHandler, Injectable } from '@angular/core';
import { Utilisateur } from '../models/utilisateur.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({
     'Content-Type': 'application/json',
     
    // 'Access-Control-Allow-Origin':'http://localhost:8081'
    
    })
};
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  apiURL = environment.backendServer
  currentUser: any;
  token: string ;
  nbrNotifi : number;
  private socket;

  constructor(public  http: HttpClient,private tokenStorage: TokenStorageService) { }
  
// Http Options
httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
} 

getreclamation(){
  return this.http.get(this.apiURL+'reclamations').pipe(
    retry(1)
    )
}
getAllReclamationPagination(role, date, size: number, page : number, colonne, ordre ) : Observable<any> {
 return this.http.post(this.apiURL+ 'Listereclamations' , {
   size : size,
   page : page,
   colonne : colonne,
   ordre : ordre,
   role :role,
   date : date

   
  }, httpOptions);
}
getMedecinByName(idPatient : number) : Observable<any>{
 return this.http.post(this.apiURL+'medecin/nom', {'idPatient' : idPatient}, httpOptions)
  
}
getNotification(identifiant :any, colonne :string, ordre :String, page, size, typenotification, dateNotification, ) : Observable<any> {
 
  return this.http.post(this.apiURL+'getNotification', {'identifiant' : identifiant, 'colonne' : colonne,
   'ordre' : ordre, 'page' : page, 'size' : size, 'typeNotification' : typenotification, 'dateNotification' : dateNotification}, httpOptions)
   

}
getNotificationNonLus(identifiant :any){
  return this.http.post(this.apiURL+'getNotificationNonLus', {'identifiant' : identifiant}).toPromise()

}
updateNotification(idNotification :any,identifiant:any){
  return this.http.post(this.apiURL+'SetNotification', {'identifiant' : identifiant,'idNotification':idNotification}).toPromise()

}
countnotification(identifiant :any){
  return this.http.post(this.apiURL+'countnotification', {'identifiant' : identifiant}).toPromise()

}
searhnotification(identifiants:any,data){
  return  this.http.post(this.apiURL+'searhnotification',
  {
    identifiant:identifiants,
    dateNotification:data.searchdate,
    typenotification:data.typenotification
  
  }, this.httpOptions,)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )

}
searchreclamation(data){
  return  this.http.post(this.apiURL+'searchreclamation',
  {
    
    date:data.searchdate,
    role:data.typenotification
  
  }, this.httpOptions,)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )

}


addPermission(patient:string,medecin:string,userLabo){
 return  this.http.post(this.apiURL+'labo/accordpermissionMedecinLabo',{'idPatient':patient,'idMedecin':medecin,'userLabo':userLabo}).toPromise();
}

  getAllUsers():Observable<Utilisateur> {
    return this.http.get<any>(this.apiURL+'getAllUsers').pipe(
      retry(1)
    )
    
    
  }
  getPatient(){
    return this.http.get(this.apiURL+'getPatient');
  }
  getMedecin(){
    
    return this.http.get(this.apiURL+'getMedecin',{});
  }
  getinfoPatient(){

  }
  getInfoMedecin(identifiant :any){
    return this.http.post(this.apiURL+'medecin/getListePatient',{'identifiant':identifiant}).toPromise();
  } 
  getinfoUserLabo(identifiant:any){
    return this.http.post(this.apiURL+'infoUser',{'identifiant':identifiant}).toPromise();

  }

  profileAdmin(identifiant:any){
    return this.http.post(this.apiURL+'profileAdmin',{'identifiant':identifiant}).toPromise();

  }
  tracabilite(identifiant:any,dates){ 
       return this.http.post(this.apiURL+'getTracabilite', 
       {'identifiant' : identifiant,
        'date':dates
      }).toPromise()
  }
  getInfoPatient(identifiant: string) {
    return this.http.post(this.apiURL+'patient/getListeCrr', {'identifiant' : identifiant}).toPromise();
}

updateUser(user,userLabo) : Observable<any> {
 return this.http.put<Utilisateur>(this.apiURL+'updateUser',{
  nom: user.nom,
  prenom: user.prenom,
  sexe: user.sexe,
  dateNaissance: user.dateNaissance,
  telephone: user.telephone,  
  email: user.email,
  adresse: user.adresse,
  etatCivil: user.etatCivil,
  cin: user.cin, 
  userLabo:userLabo,
  identifiant:user.identifiant,
  ville:user.ville
 },this.httpOptions);
}
bloquerUser(identifiant: string,userLabo:string){
  return this.http.put(this.apiURL+'lockUnlockCount', {identifiant : identifiant,
    userLabo:userLabo
  
  }).pipe(
    retry(1),
    catchError(this.handleError)
  )
 }
 suppression(identifiant,userLabo){
   return this.http.post(this.apiURL+'deleteUser',{identifiant:identifiant,userLabo:userLabo}
  
  ).pipe(
    retry(1),
    catchError(this.handleError)
  )
 }
 retrievePrermission(medecin,patient,idPermission,userLabo){
  return this.http.put(this.apiURL+'retrievePrermission',{medecin:medecin,patient:patient,idPermission:idPermission,userLabo:userLabo}
  
  ).pipe(
    retry(1),
    catchError(this.handleError)
  )
 }
handleError(error) {
  let errorMessage = '';
  if(error.error instanceof ErrorEvent) {
    // Get client-side error
    errorMessage = error.error.message;
  } else {
    // Get server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  window.alert(errorMessage);
  return throwError(errorMessage);
}
//this.tokenStorage.getToken()
createPatient (user,newnom,userLabo):  Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiURL+'addPatient', {
      nom: user.nom,
      prenom: user.prenom,
      sexe: user.sexe,
      dateNaissance: user.dateNaissance,
      telephone: user.telephone,
      identifiant: newnom,
      email: user.email,
      adresse: user.adresse,
      etatCivil: user.etatCivil,
      cin: user.cin,
      ipp:user.ipp,
      ville : user.ville,
      userLabo:userLabo
    }, this.httpOptions,)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  
  createUserLabo(user,newnom,userLabo):  Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiURL+'addUserLabo', {
      nom: user.nom,
      prenom: user.prenom,
      sexe: user.sexe,
      dateNaissance: user.dateNaissance,
      telephone: user.telephone,
      identifiant: newnom,
      email: user.email,
      adresse: user.adresse,
      etatCivil: user.etatCivil,
      cin: user.cin,
      userLabo:userLabo
    }, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  
  createmedecinWithfile(csvArr):  Observable<any> {
  
    return this.http.post(this.apiURL+'file',{
      file : csvArr,
    }, this.httpOptions);
    
  }
  createMedecin (user,newnom,userLabo):  Observable<Utilisateur> {
     return this.http.post<Utilisateur>(this.apiURL+'addMedecin',{
      nom: user.nom,
      prenom: user.prenom,
      sexe: user.sexe,
    
      telephone: user.telephone,
      identifiant: newnom,
      email: user.email,
      adresse: user.adresse,
      ville: user.ville,
      cin: user.cin,
      specialite:user.specialite,
      userLabo:userLabo
    }, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
} 



createAdminLabo(user,newnom,userLabo):  Observable<Utilisateur> {
  return this.http.post<Utilisateur>(this.apiURL+'addAdminLabo', {
    nom: user.nom,
    prenom: user.prenom,
    sexe: user.sexe,
    dateNaissance: user.dateNaissance,
    telephone: user.telephone,
    identifiant: newnom,
    email: user.email,
    adresse: user.adresse,
    etatCivil: user.etatCivil,
    cin: user.cin,
    userLabo:userLabo
  }, this.httpOptions)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
}  
createAdminSilogik(user,newnom,userLabo):  Observable<Utilisateur> {
  return this.http.post<Utilisateur>(this.apiURL+'addAdminSilogik', {
    nom: user.nom,
    prenom: user.prenom,
    sexe: user.sexe,
    dateNaissance: user.dateNaissance,
    telephone: user.telephone,
    identifiant: newnom,
    email: user.email,
    adresse: user.adresse,
    etatCivil: user.etatCivil,
    cin: user.cin,
    userLabo:userLabo
  }, this.httpOptions)
  .pipe(
    retry(1),
    catchError(this.handleError)
  )
} 
getOneUser(email:string,ipp:string){
    return this.http.post(this.apiURL+'userbyemail', {'email' : email,'ipp':ipp}).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  IsconnetedPatient(){
    return this.http.get(this.apiURL+'countPatient');

  }
  IsconnetedMedecin(){
    return this.http.get(this.apiURL+'coutnMedecin');

  }
  getCRR(){
    return this.http.get(this.apiURL+'labo/getCRR');
  }
  getCRRDuJour(dateCreation, page, size): Observable<any> {
  return this.http.post(this.apiURL+'labo/getCRRDuJour',{
      dateCreation : dateCreation,
      size : size,
      page : page
      },httpOptions);
  }
  getAllMedecin(params): Observable<any> {
    return this.http.post(this.apiURL+'getUserLabo',{
    nomMedecin : params.nomMedecin,
    specialite : params.specialite,
    size : params.size,
    page : params.page
    },httpOptions);
  }
  getCRRbyDate(dates){
    return this.http.post(this.apiURL+'labo/getCRRbyDate',{
      date:dates
    },this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getListeMedecinOfPatient(identifiant){
    return this.http.post(this.apiURL+'getListeMedecinOfPatient',{'identifiant':identifiant}).toPromise();

  }
  logout(id:any){
    return this.http.put(this.apiURL+'logout',{
      idUtilisateur:id
    }).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  
  getCountNumber(numb){
     this.nbrNotifi=numb
  
    
  }

  sendCountNumber(){
   return this.nbrNotifi;

  }
  
}
