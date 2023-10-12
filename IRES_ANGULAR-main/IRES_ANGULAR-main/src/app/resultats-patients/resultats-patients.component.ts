import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/controller/services/auth.service';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { environment } from 'environments/environment.prod';
@Component({
  selector: 'app-resultats-patients',
  templateUrl: './resultats-patients.component.html',
  styleUrls: ['./resultats-patients.component.css']
})
export class ResultatsPatientsComponent implements OnInit {
  colonne = 'dateCreation';
  ordreDate = 'DESC';
  ordreNumDossier = 'DESC';
  visibilite= true;
  urlAssets = environment.url
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
  form = {
    numDossier: '',
    nomPatient : ''
  };
  nomMedecin = '';
  dateDebut = '';
  dateFin = '';
  dateInvalide =false;
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 50];
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
   onKey(value: string ) {
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
  getRequestParams(searchNumDossier, searchNomPatient, searchDateDebut,serachDateFin, page, pageSize): any {
    // tslint:disable-next-line:prefer-const
    let params = {};

    if (searchNumDossier) {
      params[`numDossier`] = searchNumDossier;
    }
    if (searchNomPatient) {
      params[`nomPatient`] = searchNomPatient;
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
  
    const params = this.getRequestParams(this.form.numDossier, this.form.nomPatient, this.dateDebut, this.dateFin, this.page, this.pageSize);
   
    if(this.dateDebut && this.dateFin){
    if(this.dateDebut < this.dateFin){
  
      this.authService.getAllCrroaginationMedecin(params, this.identifiant, colonne, ordre)
      .subscribe(
        data => {
     
          if(data){
          const  crr = data.response.users;
          const totalItems = data.response.totalItems
          this.crr =  crr;
          this.count = totalItems;
          }
        },
        error => {
          console.log("pas de compte rendu ");
        });
    }
    else{
      console.log("")
    }
    }
    else{
      this.authService.getAllCrroaginationMedecin(params, this.identifiant, colonne, ordre)
      .subscribe(
        data => {
       
          if(data){
          const  crr = data.response.users;
          const totalItems = data.response.totalItems
          this.crr =  crr;
          this.count = totalItems;
          }
        },
        error => {
          console.log("pas de compte rendu ");
        });
    }
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
