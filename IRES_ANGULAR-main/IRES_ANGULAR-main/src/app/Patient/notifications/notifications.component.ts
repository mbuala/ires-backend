import { Component, OnInit, } from '@angular/core';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { Router } from '@angular/router';

declare var $: any;


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {

    identifiant: string ;
    role : string;
    date : any;
    type :string;
    colonne = 'dateNotification';
    ordreDate = 'DESC';
    colonne1 = 'date';
    ordre1 = 'DESC';
    ordreTypeNotification = 'DESC';
    message : string
    taille = 80
    currentUser: any;
    token: string ;
    Notification:[]
    Reclamation:any=[]
    val:any=[]
    nbrnoticationNonlus = 0;
    //PAGINATION
    page : number = 1;
    count: number = 0;
    count1 : number = 0;
    newvalue=5;
    tableSize : number = 2;
    tableSizes = [2, 10,20,30,50,100];
    currentElement: any ;
    currentIndex = -1;
    pageSize = 10;
    pageSizes = [10,20,50];
    searchdate: '';
    typenotification =''
    roleUser =''
    params = {};
    reclamations : [];
    searchactivite: FormGroup;
    coun =5 ;
 
  constructor(private formBuilder: FormBuilder,
    private tokenStorage: TokenStorageService,private restApi: UtilisateurService,private confirmationDialogSrv: ModalConfirmationService, private router : Router) { }
  ngOnInit() {
      // recuperer l'identifiant de l'utilisateur connecté
    this.identifiant=this.tokenStorage.getUser().user.identifiant;
       // recuperer son role 
    this.role=this.tokenStorage.getUser().role;
    this.retrieveReclamationsPag(this.colonne1, this.ordre1)
    this.getNotification(this.colonne, this.ordreDate)    
  }
  
  onKey(value) {
    if(!value){
      this.getNotification(this.colonne, this.ordreDate);
    }
   
  }
  // si c 'est un admin : recuperer les reclamations
 retrieveReclamationsPag(colonne, ordre): void {
   this.restApi.getAllReclamationPagination(this.roleUser, this.date, this.pageSize, this.page-1, colonne, ordre)
      .subscribe(
        data => {
          if(data){
          this.reclamations = data.response.elements;
          const totalItems = data.response.totalItems
          this.count1 = totalItems;
        } },
        error => {
          console.log("pas de reclamations ");
        });
  }
  // si c'est un patient ou medecin :  recuperer les notifications
  getNotification(colonne, ordre){
    this.restApi.getNotification(this.identifiant, colonne, ordre, this.page-1, this.pageSize, this.typenotification, this.searchdate)
    .subscribe(data=>{
     this.Notification=data.response.elements
     const totalItems = data.response.totalItems
          this.count = totalItems; 
    })
      this.restApi.countnotification(this.identifiant).then(data=>{
      this.val=data
      this.nbrnoticationNonlus= this.val.count
     })
  }
  
  setActiveElement(element, index): void {
    this.message = element;
  }

  setActiveElement1(element, index): void {
    this.currentElement = element;
    this.currentIndex = index;   
    if (this.currentElement.status==false) {
      this.restApi.updateNotification(this.currentElement.idNotification,this.identifiant).then(data=>{
        if(data){ 
         this.nbrnoticationNonlus =  this.nbrnoticationNonlus - 1
         this.restApi.getCountNumber(this.nbrnoticationNonlus);
           this.ngOnInit()   
        }
       })  } 
     if(this.currentElement.typeNotification == 'Nouveau médecin')
    {
      this.router.navigate(['/patient/medecins']);
    }
    else if(this.currentElement.typeNotification == 'Nouveau patient')
    {
      this.router.navigate(['/medecin/listePatient']);
    }
    else{
      this.router.navigate(['/patient/resultatsCRR']);
    }
  }

  ReclamationhandlePageChange(event): void {
    this.page = event;
       this.retrieveReclamationsPag(this.colonne1, this.ordre1);
  }

  ReclamationhandlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveReclamationsPag(this.colonne1, this.ordre1);
  }

  NotificationhandlePageChange(event): void {
    this.page = event;
    this.getNotification(this.colonne, this.ordreDate)
  }

  NotificationhandlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getNotification(this.colonne, this.ordreDate)
  }
}