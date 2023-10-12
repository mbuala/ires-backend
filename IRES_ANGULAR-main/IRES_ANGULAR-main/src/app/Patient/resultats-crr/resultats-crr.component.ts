import { Component, Input, OnInit } from '@angular/core';
import {  AuthService} from 'app/controller/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ValidatorFn } from '@angular/forms';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-resultats-crr',
  templateUrl: './resultats-crr.component.html',
  styleUrls: ['./resultats-crr.component.css']
})

export class ResultatsCRRComponent implements OnInit {
   colonne = 'dateCreation';
   ordreDate = 'DESC';
   ordreNumDossier = 'DESC';
   form = {
    numDossier: '',
    nomMedecin:'',
         };
  dateInvalide =false;
  visibilite= true;
  listeCrr:any=[];
  title = '';
  currentUser: any ;
  currentElement: any ;
  currentIdentifiant : any;
  identifiant: string;
  idMedecin :'';
  idPatient: '';
  idCRR : '';
  crr: any;
  patients : any;
  currentCrr = null;
  currentIndex = -1;
  //numDossier = '';
  nomMedecin = '';
  nomPatient = '';
  @Input() dateDebut = '';
  @Input() dateFin = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [];
  permission = '' ;
  per = '';
  role: string ;
  ValRole : boolean;
  getLinks: any;
  modalContent: any;
  userCurrent : any;
  urlSafe: SafeResourceUrl;
  open :boolean =false;
  url :string;
  urlAssets = environment.url
   onKey(value) {
    if(!value){
      this.retrieveCrrPag(this.colonne, this.ordreDate);
    }
   
  }
  constructor(private tokenStorage: TokenStorageService, private authService : AuthService, private modal: NgbModal,  private confirmationDialogSrv: ModalConfirmationService,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser().user;
    this.identifiant = this.currentUser.identifiant
    this.role = this.tokenStorage.getUser().role;
    this.retrieveCrrPag(this.colonne, this.ordreDate);
 }
  elog(value) {
    if(this.dateDebut && this.dateFin && this.dateDebut > this.dateFin){
     this.dateInvalide = true
    }
    else{
      this.dateInvalide = false
    }
}
  // Patient
  getRequestParams(searchNumDossier, searchNomMedecin, searchDateDebut,serachDateFin, page, pageSize): any {
    let params = {};
    if (searchNumDossier) {
      params[`numDossier`] = searchNumDossier;
    }
    if (searchNomMedecin) {
      params[`nomMedecin`] = searchNomMedecin;
    }
    if (searchDateDebut) {
      params[`dateDebut`] = searchDateDebut;
    }
     if (serachDateFin) {
      params[`dateFin`] = serachDateFin;
    }
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }
  retrieveCrrPag(colonne, ordre): void {
   const params = this.getRequestParams(this.form.numDossier, this.form.nomMedecin, this.dateDebut, this.dateFin, this.page, this.pageSize);
   this.authService.getAllCrroagination(params, this.identifiant, colonne, ordre)
      .subscribe(
        data => {
          if(data){
          const  crr = data.response.users;
          console.log(crr)
          const totalItems = data.response.totalItems
          this.crr =  crr;
          this.count = totalItems;
          this.pageSizes = [10, 20, 50]
          }
        },
        error => {
          console.log("pas de compte rendu ");
        });
  }
  OpenPdf(CompteRendu) {
    this.open = true;
    this.url=CompteRendu.compterendu.path;
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.authService.voirCRRPatient(CompteRendu.idCRR)
    .subscribe(
      data => {
        if(data){
        this.retrieveCrrPag(this.colonne, this.ordreDate);
        }
      },
      error => {
        console.log("Erreur");
      });
 }
 setActiveElement(element, index): void {
    this.currentElement = element;
    this.currentIndex = index;
  }
updatetogglerow(element , $event): void {
  $event.preventDefault();
if(element.permission){
  this.per= "false";
}
else {
  this.per= "true"
}
this.idMedecin = element.idMedecin;
this.idPatient = element.idPatient;
this.idCRR = element.compterendu.idCRR;

        this.confirmationDialogSrv.confirm('Visibilité ','Êtes-vous sûr de vouloir modifier la visibilité de ce compte rendu ?').then((confirmed) => {
          element.permission= !element.permission;
          this.authService.visibilite(this.idMedecin, this.idPatient, this.idCRR, this.per)
          .subscribe(
            data => {
              this.confirmationDialogSrv.alert('Succés ', 'La visibilité a bien été modifié').then((confirmed) => {}).catch(() => console.log('error'));
    },
            error => {
              console.log(error);
            });
 }).catch(() => console.log('error'));      
  }
handlePageChange(event): void {
    this.page = event;
    this.retrieveCrrPag(this.colonne, this.ordreDate);
  }
  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveCrrPag(this.colonne, this.ordreDate);
  }
}
