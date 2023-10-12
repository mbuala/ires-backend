import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { ActivatedRoute, Router } from "@angular/router";
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from 'app/controller/services/auth.service';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-info-patient',
  templateUrl: './info-patient.component.html',
  styleUrls: ['./info-patient.component.css']
})

export class InfoPatientComponent implements OnInit {
  urlAssets = environment.url
  colonne = 'dateCreation';
  ordre = 'DESC'
  open :boolean =false;
  dateNaissance : string;
  ListeCRRInfoPatient: any = []
  ipp:any
  liste:any=[]
  value = 0
  identifiant: any;
  tracabilite: any = []
  //PAGINATION
  page = 1;
  pages=1;
  count = 0;
  trcount = 0;
  tableSize = 1;
  TrtableSize = 10;
  trtableSizes = [10, 20, 30, 50, 100];
  tableSizes = [10, 20, 30, 50, 100];
  pageSize = 10;
  dateInvalide =false;
  //RECHERCHE
  filterTerm: string;
  form: FormGroup;
  MedecinListe: any = []
  Medecin: any = []
  //RECHERCHE MEDECIN AUTO COMPLETE
  rechercheMedecin: string
  text: '';
  verif = false

  params = {};
  searchdate: '';
  formu = {
    numDossier: '',
    nomMedecin:'',

  };
  
  nomPatient = '';
  dateDebut = '';
  dateFin = '';
  currentCrr = null;
  desc = false;
  idPatient : number;
  ordreNumDossier =false;
  listeMedecinPatient: any = []
  medliste:any=[]
  pageSizes = [];
  crr: any;
  currentElement: any;
  currentIndex = -1;
  @ViewChild('addMedecin') addMedecin: ElementRef;
  @ViewChild('alert') alert: ElementRef;


  getLinks:SafeResourceUrl
userLabo:any


  pipe = new DatePipe('en-US');
  constructor(
    private restApi: UtilisateurService, 
    public router: Router, 
    public activeRoute: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private confirmationDialogSrv: ModalConfirmationService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private sanitizer: DomSanitizer


  ) { }
  ngOnInit(): void {
    this.userLabo= this.tokenStorage.getUser().user.idUtilisateur;
    this.identifiant = this.activeRoute.snapshot.params['identifiant'];
    this.restApi.getInfoPatient(this.identifiant).then((response) => {
      this.ListeCRRInfoPatient = response;
      this.ipp= this.ListeCRRInfoPatient.patient.ipp
      this.idPatient = this.ListeCRRInfoPatient.patient.idPatient
    
      this.liste= this.ListeCRRInfoPatient.user
    
      this.dateNaissance = this.liste.dateNaissance
      this.dateNaissance = this.pipe.transform(this.liste.dateNaissance, 'dd-MM-yyyy');
    })
    this.alltracabilite()
    this.form = this.formBuilder.group({
      patient: ['',],
      rechercheMedecin: ['', Validators.required],
      medecin: ['',]
    });
     //this.loadMedecin();
    this.retrieveCrrPag(this.colonne, this.ordre)
    this.getMedecin()
  }
  getMedecin() {
    this.restApi.getListeMedecinOfPatient(this.identifiant).then(data => {
      this.listeMedecinPatient = data;
   

    })
  }
  refreshList(): void {
    this.retrieveCrrPag(this.colonne, this.ordre);
    this.currentCrr = null;
    this.currentIndex = -1;
  }

  elog(value) {
    if(this.dateDebut && this.dateFin && this.dateDebut > this.dateFin){
   
      this.dateInvalide = true
    }
    else{
      this.dateInvalide = false
    }
    
}
  getRequestParams(searchNumDossier, searchNomMedecin, searchDateDebut, serachDateFin, page, pageSize): any {
    // tslint:disable-next-line:prefer-const
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
    
    const params = this.getRequestParams(this.formu.numDossier, this.formu.nomMedecin, this.dateDebut, this.dateFin, this.page, this.pageSize);    
   
    this.authService.getAllCrroagination(params, this.identifiant, colonne, ordre)
      .subscribe(
        data => {
          if (data) {
            const crr = data.response.users;
            const totalItems = data.response.totalItems
            this.crr = crr;
          
            this.count = totalItems;
            this.pageSizes = [10, 20, 50]          
          }
        },
        error => {         
        });
  }
  setActiveElement(element, index): void {
    this.currentElement = element;
    this.currentIndex = index;
 
  }
  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveCrrPag(this.colonne, this.ordre);
  }
  handlePageChange(event): void {
    this.page = event;
    this.retrieveCrrPag(this.colonne, this.ordre);
  }
  getdatebytracabilite() {
    this.params = this.getActivite(this.searchdate);
    this.restApi.tracabilite(this.identifiant, this.params).then((response) => {
      this.tracabilite = response;
    
    })
  }
  getActivite(searchDate): any {
    if (searchDate) {
      this.params = searchDate;
    }
    return this.params;
  }
  alltracabilite() {
    this.restApi.tracabilite(this.identifiant, null).then((response) => {
      this.tracabilite = response; 
     
      this.trcount= this.tracabilite.historique.length
    
    })
  }
  onKeyactivite(value: string) {
    if (!value) {
      this.alltracabilite();
    }
  }
  get f() {
    return this.form.controls;
  }
  onTableDataChange(event) {
    this.page = event;
    this.retrieveCrrPag(this.colonne, this.ordre);
  }
  onTableDataChangTracabilitee(event) {
    this.pages = event;
    this.tracabilite;
  }
  onTableSizeChangeracabilitee(event): void {
    this.TrtableSize = event.target.value;
    this.pages = 1;
    this.tracabilite;
  }


  // onTableSizeChange(event): void {
  //   this.pageSize  = event.target.value;
  //   this.page = 1;
  //   this.retrieveCrrPag(this.colonne, this.ordre);
  // }
  getactivite(searchDate): any {
    if (searchDate) {
      this.params = searchDate;
    }
    return this.params;
  }
  onKey(value: string) {
    if (!value) {
      this.retrieveCrrPag(this.colonne, this.ordre);
    }
  }
  ajouterMedecin() {
    this.restApi.getInfoMedecin(this.form.value.medecin).then((response) => {
      this.Medecin = response
    
      this.restApi.addPermission(this.ListeCRRInfoPatient.patient.idPatient, this.Medecin.medecin.idMedecin,this.userLabo).then((response) => {
        this.addMedecin.nativeElement.click();
        this.verif = true
        this.ngOnInit();
        this.confirmationDialogSrv.alert('Succès', 'Médecin prescripteur ajouté avec succès').then((confirmed) => {  }).catch(() => console.log('error'));
      })
    })
  }
  loadMedecin() {
    this.restApi.getMedecinByName(this.idPatient).subscribe(data => {
      this.MedecinListe = data;
      
   })
  }
  retrievepermission(medecin,patient,idPermission){
    this.confirmationDialogSrv.confirm('Medecin Prescripteur ', 'Suppression du médecin, continuer?').then((confirmed) => {
      this.restApi.retrievePrermission(medecin,patient,idPermission,this.userLabo).subscribe(data=>{
        this.ngOnInit()
        this.confirmationDialogSrv.alert('Succès', 'Médecin supprimé avec succès').then((confirmed) => {  }).catch(() => console.log('error'));
      })
         
    }).catch(() => console.log('error'));
   
  }

   
  getpath(getLink) {
    this.open=true
   
    this.getLinks = this.sanitizer.bypassSecurityTrustResourceUrl(getLink);
    return this.getLinks;
  }
}
