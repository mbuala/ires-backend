import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'app/controller/services/auth.service';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-liste-patient',
  templateUrl: './liste-patient.component.html',
  styleUrls: ['./liste-patient.component.css']
})
export class ListePatientComponent implements OnInit {

  currentUser: any ;
  identifiant: string;
  role: string ;
  urlAssets = environment.url
  visibilite= true;
  listeCrr:any=[];
  title = ''
  currentElement: any ;
  currentIdentifiant : any;
  idMedecin :'';
  idPatient: '';
  idCRR : '';
  crr: any;
  patients : any;
  currentCrr = null;
  currentIndex = -1;
  numDossier = '';
  numDossierCRR = '';
  form1 = {
    numDossierCRR1 : ''
  }
  nomMedecin = '';
  form = {
    nomPatient : ''
  }
  dateDebut = '';
  dateFin = '';
  page = 1;
  page1 = 1;
  count = 0;
  count1 = 0;
  pageSize = 10;
  pageSize1 = 10;
  pageSizes = [10, 20, 50,];
  pageSizes1 = [];
  permission = '' ;
  per = '';
  dateInvalide =false;
  urlSafe: SafeResourceUrl;
  open :boolean =false;
  url :string;
  ValRole : boolean;
  userCurrent : any;

  constructor(private tokenStorage: TokenStorageService, private authService : AuthService ,private sanitizer: DomSanitizer) {}

  onKey(value: string ) {
    if(!value){
      this.retrievePatientPag();
    }
  }
  onKey1(value: string ) {
    if(!value){
      this.retrieveCrrPatientMedecin();
    }
  }
  elog(value) {
    if(this.dateDebut && this.dateFin && this.dateDebut > this.dateFin){
      this.dateInvalide = true
    }
    else{
      this.dateInvalide = false
    }
    
}
  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser().user;
    this.identifiant = this.currentUser.identifiant
    this.role = this.tokenStorage.getUser().role;
    this.retrievePatientPag();
  }
  // recuperer les parametres de recherche et pagination 
  getRequestParams(searchNumDossier ,searchNomPatient, page, pageSize): any {
    // tslint:disable-next-line:prefer-const
    let params = {};
    if (searchNumDossier) {
      params[`numDossier`] = searchNumDossier;
    }
    if (searchNomPatient) {
      params[`nomPatient`] = searchNomPatient;
    }
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }
  // recuperer les parametres de recherche et de pagination pr les crr d'un patient
  getRequestParamsCrrPatientMedecin( searchNumDossier1 ,  searchDateDebut1, serachDateFin1,page1, pageSize1): any {
    // tslint:disable-next-line:prefer-const
    let params = {};
    if (searchNumDossier1) {
      params[`numDossierCRR1`] = searchNumDossier1;
    }
    if (searchDateDebut1) {
      params[`dateDebut`] = searchDateDebut1;
    }
    if (serachDateFin1) {
      params[`dateFin`] = serachDateFin1;
    }
    if (page1) {
      params[`page1`] = page1 - 1;
    }
    if (pageSize1) {
      params[`size1`] = pageSize1;
    }
    return params;
  }
  // recuperer la liste des patient avec pagination et recherche 
  retrievePatientPag(): void {
    const params = this.getRequestParams(this.numDossier ,this.form.nomPatient , this.page, this.pageSize);
    this.authService.getAllPatientMedecin(params, this.identifiant)
      .subscribe(
        data => {
          this.patients = data.response.users;
          const totalItems = data.response.totalItems
          this.count = totalItems;
        },
        error => {
          console.log(error);
        });
  }
// recuperer les crr d un patient(active item)
  retrieveCrrPatientMedecin(): void {
  const param = this.getRequestParamsCrrPatientMedecin(this.form1.numDossierCRR1, this.dateDebut, this.dateFin, this.page1, this.pageSize1);
  this.idPatient = this.currentElement.idPatient
  this.authService.getCrrPatientMedecin(param, this.identifiant, this.idPatient)
    .subscribe(
      data => {
        if(data){
        this.crr = data.response.users;
        const totalItems = data.response.totalItems
        this.count1 = totalItems;
        this.pageSizes1 = [10, 20, 50]
        }
      },
      error => {
        console.log("pas de compte rendu ");
      });
}

  setActiveElement(element, index): void {
    this.form1.numDossierCRR1 = ''
    this.dateDebut = ""
    this.dateFin =""
    this.currentElement = element;
    this.currentIndex = index;
    this.currentIdentifiant = this.currentElement.user.identifiant;
    this.retrieveCrrPatientMedecin()
  }

   handlePageChange(event): void {
    this.page = event;
    this.retrievePatientPag();
   }
   handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrievePatientPag();
   }
   handlePageChange1(event): void {
    this.page1 = event;
    this.retrieveCrrPatientMedecin()
   }
   handlePageSizeChange1(event): void {
    this.pageSize1 = event.target.value;
    this.page1 = 1;
    this.retrieveCrrPatientMedecin()
 
   }
   OpenPdf(CompteRendu) {
    this.open = true;
    this.url=CompteRendu.compterendu.path;
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.authService.voirCRRMedecin(CompteRendu.idCRR)
    .subscribe(
      data => {
        if(data){
        this.retrieveCrrPatientMedecin();
        }
      },
      error => {
        console.log("Erreur");
      });
   
  }

 
}
