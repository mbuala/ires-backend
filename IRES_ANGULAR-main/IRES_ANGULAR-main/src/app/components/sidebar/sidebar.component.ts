import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { environment } from '../../../environments/environment';

// import { protractor } from '../../../protractor.config'
declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    show:boolean
    }

const baseUrl = environment.backendServer
export const ROUTES: RouteInfo[] = [
    { path: '/patient/user-profile', title: ' Profil',  icon:'person', class: '',show:false, },
    { path: '/patient/resultatsCRR', title: 'Résultats',  icon:'content_paste', class: '',show:false, },
    { path: 'patient/medecins', title: 'Médecins',  icon:'groups', class: '', show:false, },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '',show:true, },
    { path: '/contact', title: 'Contact',  icon:'library_books', class: '',show:false, },
 
];
export const ROUTESLabo: RouteInfo[] = [
  { path: '/adminLabo/dashboard', title: 'Acceuil',  icon: 'dashboard', class: '',show:false, },
  { path: '/adminLabo/adminProfil', title: 'Profil',  icon:'person', class: '',show:false, },
  { path: '/adminLabo/gestionCompte', title: 'Gestion des comptes',  icon:'content_paste', class: '',show:false, },
  { path: '/admin/notifications', title: 'Réclamations',  icon:'notifications', class: '',show:true}, 
];

export const ROUTESMedecin: RouteInfo[] = [
  { path: '/patient/user-profile', title: ' Profil',  icon:'person', class: '',show:false, },
  { path: 'medecin/ResultatsPatients', title: 'Résultats',  icon:'content_paste', class: '',show:false, },
  { path: 'medecin/listePatient', title: 'Patients',  icon:'groups', class: '',show:false, },
  { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '',show:true, },
  { path: '/contact', title: 'Contact',  icon:'library_books', class: '',show:false, },

];
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  roleUser: string ;
  val:any=[]
  logo = environment.url
  url = '';
  currentUser: any;
  token: string ;
  Notification:any=[]
  nbr:number
  constructor(private tokenStorage: TokenStorageService ,private restApi: UtilisateurService) { }
  ngOnInit() {
    this.roleUser = this.tokenStorage.getUser().role;
    this.currentUser=this.tokenStorage.getUser().user;
    this.selectrole();
    if(this.roleUser == "patient"){
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    else if(this.roleUser == "labo" || this.roleUser == "adminSilogik" || this.roleUser == "userLabo" ){
      this.menuItems = ROUTESLabo.filter(menuItem => menuItem);
    }
    else {
      this.menuItems = ROUTESMedecin.filter(menuItem => menuItem);
    }
    
 

 
}

selectrole(){
  if(this.roleUser == 'patient'){
   
    this.url = '/patient/resultatsCRR'
  }
  else if(this.roleUser == 'medecin')
  {
  
    this.url = '/medecin/listePatient'
  }
  else if(this.roleUser == 'labo' || this.roleUser == "adminSilogik" || this.roleUser == "userLabo"  ){
    this.url = '/adminLabo/dashboard'

  }
}

isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
};
}