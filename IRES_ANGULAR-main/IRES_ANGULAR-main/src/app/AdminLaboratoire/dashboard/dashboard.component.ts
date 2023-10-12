import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Chartist from 'chartist';
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { Utilisateur } from 'app/controller/models/utilisateur.model';
import { AlertService, } from 'app/controller/services/alert.service';
import { ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, Injectable } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';

import { Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DemoMaterialModule } from 'app/material-module';
import { VERSION } from '@angular/core';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export class CsvData {
  public id: any;
  public min: any;
  public max: any;
  public score: any;
}
declare var $: any;
// @Pipe({
//   name: 'safe'
// })
// @Injectable({
//   providedIn: 'root',
// })
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  //  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dashboard.component.css',

  ],
})

export class DashboardComponent implements OnInit {
  pageSize = 10;
  pageSizes = [10,20,50];
  displayedColumns: string[] = ['id', 'nom'];
  dataSource: MatTableDataSource<Utilisateur>
  disableSelect = new FormControl(false);
  page = 1;
  urlAssets = environment.url
  dateCreation = new Date();
  csvArr = [];
  urlSafe: SafeResourceUrl;
  open: boolean = false;
  url: string;
  User: Utilisateur = new Utilisateur();
  userListe: any = []
  medecin: any = []
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  showbtn=false
  disabled =false;
  erordata: any = []
  mede: FormGroup;
  labo: FormGroup;
  countPatient: any = []
  countmedecin: any = []
  crr: any = []
  crrs: any = []
  ListeCRR : [];
  verif = false
  errorMessage = '';
  typeUser: string
  currentUser: any;
  role: any
  token: string;
  identifiant: string;
  NbrPatient: '';
  NbrMedecin: '';
  searchDate: '';
  
  params = {};
  date :  string ;
  getLinks: SafeResourceUrl
  countcrr: number
  count = 0;
  listeDesPatient: any = []
  listeDesMedecin: any = []
  emails = [];
  DesMedecin: any = []
  formvalue: boolean = true
  medecinvalue: boolean = true
  labovalue: boolean = true
  content : ''
  apiURL = environment.backendServer
  @ViewChild('addPatient') addPatient: ElementRef;
  @ViewChild('addMedecin') addMedecin: ElementRef;
  @ViewChild('addUserLabo') addUserLabo: ElementRef;
  @ViewChild('someModal') someModal: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  exceltoJson = {};
  public records: any[] = [];
  images;
  multipleImages = [];
  @ViewChild('csvReader') csvReader: any;
  jsondatadisplay: any;
  pipe: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UtilisateurService,
    private alertService: AlertService,
    private tokenStorage: TokenStorageService
    , private confirmationDialogSrv: ModalConfirmationService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private datePipe :DatePipe,
    private modalFirstLogin: NgbModal

  ) { }
  
 
  
  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsondatadisplay = '';
  }

  
  PatientListe: any = []
  loadPatient() {
    this.userService.getPatient().subscribe(data => {
      this.PatientListe = data;
      this.listeDesPatient = this.PatientListe.patient
      this.NbrPatient = this.listeDesPatient.length
    })
    this.userService.IsconnetedPatient().subscribe(data => {
      this.countPatient = data
    })
  }
  MedecinListe: any = []
  loadMedecin() {
    this.userService.getMedecin().subscribe(data => {
      this.MedecinListe = data;
      this.listeDesMedecin = this.MedecinListe.medecin

      this.NbrMedecin = this.listeDesMedecin.length
    })
    this.userService.IsconnetedMedecin().subscribe(data => {
      this.countmedecin = data
    })
  }
  onFileChange(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    if (this.isValidExcelFile(target.files[0])) {
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {      
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        this.getDataRecordsArrayFromCSVFile(data)
        //this.compareData()
      };
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    }
    else {
      alert("Please import valid .xlsx file.");
      this.fileReset();
    }
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
     let user: Utilisateur = new Utilisateur();
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (csvRecordsArray[i])
     
      user = curruntRecord
      this.csvArr.push(user);
    }
    // console.table(this.listeDesMedecin)
    
    this.userService.createmedecinWithfile(user)
    return this.csvArr;
  }
  isValidExcelFile(file: any) {
    return file.name.endsWith(".xlsx");
  }
  selectImage(event) { 
    if (event.target.files.length > 0 && this.isValidExcelFile(event.target.files[0])) {
      this.showbtn=true
     
      const file = event.target.files[0];
      this.images = file;
      document.getElementById("input1").setAttribute("disabled", "")
      document.getElementById("input2").setAttribute("disabled", "")
      document.getElementById("input3").setAttribute("disabled", "")
      document.getElementById("input4").setAttribute("disabled", "")
      document.getElementById("input5").setAttribute("disabled", "")
      document.getElementById("input6").setAttribute("disabled", "")
      document.getElementById("input7").setAttribute("disabled", "")
      document.getElementById("input8").setAttribute("disabled", "")
      document.getElementById("input9").setAttribute("disabled", "")

    }
    
    else {
      alert("Please import valid .xlsx file.");
     // this.fileReset();
    }
  }
  viderModal(){
    this.myInputVariable.nativeElement.value = '';
    this.mede.reset();
    this.form.reset();
    this.labo.reset();
    this.showbtn = false;

  }
  onSave(){
    this.emails = []
    const formData = new FormData();
    formData.append('file', this.images);
    this.userService.createmedecinWithfile(formData)   
   this.http.post<any>(this.apiURL+'file', formData)
    .subscribe(
      data => {
        
      
        console.log(data)
        for(let i =0 ; i < data.length; i++){
           this.emails.push(data[i].email)
        }
        console.log(this.emails)
        
        if(data){
          this.confirmationDialogSrv.alert('Succès', 'Les informations ont été ajoutés avec succès ').then((confirmed) => { console.log('hey') 
        }).catch(() => console.log('error'))
         }
      }
      ,
      error => this.confirmationDialogSrv.alert('Erreur ', 'Erreur lors de la création, veuillez réessayer ').then((confirmed) => {}).catch(() => console.log('error'))

    );
    
   
  }
 

  ngOnInit() {

    this.userService.getPatient().subscribe((contacts: Utilisateur[]) => {
      this.PatientListe = contacts
      this.dataSource = new MatTableDataSource(this.PatientListe.patient);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      //  console.log(this.dataSource.data)
    });
    this.role = this.tokenStorage.getUser().role;
    this.loadPatient()
    this.loadMedecin()
    // this.coubtcrrdata()
    // this.getCRR()
    this.date = this.datePipe.transform(this.dateCreation , 'yyyy-MM-dd');
    this.getCRRDuJour(this.date)
    this.identifiant = this.tokenStorage.getUser().user.idUtilisateur;

    this.mede = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
   
      sexe: ['', Validators.required],
      cin: [''],
      adresse: [''],
      ville: [''],
      telephone: ['',],
      specialite: [''],
    });
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      dateNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      cin: [''],
      adresse: [''],
      etatCivil: [''],
      telephone: ['',],
      ipp: ['', Validators.required],
      ville : ['']
    });
    this.labo = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],

      sexe: ['', Validators.required],
      cin: [''],
      adresse: [''],
      telephone: ['',],
      role: ['', Validators.required]
    });
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }
   
  }
  
  getRequestParams(searchDate): any {
    // tslint:disable-next-line:prefer-const
    if (searchDate) {
      this.params = searchDate;
    }
    return this.params;
  }
  coubtcrrdata() {
    this.userService.getCRR().subscribe(data => {
      this.crrs = data
      this.countcrr = this.crrs.count
      
    })
  }
  listecrr: any = []


  getCRRDuJour(datee){
    
    this.userService.getCRRDuJour(datee, this.page-1, this.pageSize)
    .subscribe(
      data =>{
        this.ListeCRR = data.response.elements
        
        this.count = data.response.totalItems;
      
      },
      error => {
        console.log("pas de compte rendu ");
      });
    
  }

  handlePageChange(event, datee): void {
    this.page = event;
    if(datee){
      this.date = datee
    }
    else{
      this.date = this.datePipe.transform(this.dateCreation , 'yyyy-MM-dd');
    }
    this.getCRRDuJour(this.date)
     
   
  }

  handlePageSizeChange(event, datee): void {
    this.pageSize = event.target.value;
    this.page = 1;
    if(datee){
      this.date = datee
    }
    else{
      this.date = this.datePipe.transform(this.dateCreation , 'yyyy-MM-dd');
    }
    
    this.getCRRDuJour(this.date)
     
    
  }




  public edited = false;
  

  onKey(value: string) {
    if (!value) {
      this.getCRRDuJour(this.dateCreation)
    }
  }
  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      this.formvalue = false
      return;
    } else {
      //   this.formvalue=true
      return this.createUser();
    }
  }
  get primEmail() {
    return this.form.get('email')
  }
  private async createUser() {
   
    let titreAlert = '';
    let messageAlert = '';
    let identifiant = '';
    let mdp = '';
    var newNom = this.tranformtext(this.form.value.nom, this.form.value.prenom)
    this.userService.getOneUser(this.form.value.email, this.form.value.ipp).subscribe((response) => {
      if (response == true) {
        // window.alert('email  existant')
        this.confirmationDialogSrv.alert('Info ', 'Email existant').then((confirmed) => {  }).catch(() => console.log('error'));
      } else {
        this.userService.createPatient(this.form.value, newNom, this.identifiant).subscribe(data => {
          // this.addPatient.nativeElement.click();
          this.userListe = data
          this.typeUser = 'patient'
          // $(this.someModal.nativeElement).modal('show');
          identifiant = '- Identifiant : ' + this.userListe.user.identifiant
          mdp = '- Mot de passe : ' + this.userListe.motDePasse
          titreAlert = 'Succés '
          messageAlert = identifiant + " \n " + mdp
          this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => {  }).catch(() => console.log('error'));
          this.loading = true;
          this.form.reset()
          this.submitted = false
        })
      }
    })
  }
  onCreateMedecin() {
    this.submitted = true;
    this.alertService.clear();
    if (this.mede.invalid) {
      this.medecinvalue = false
      return;
    } else {
      this.createMedecin();
    }
  }
  private createMedecin() {
    let titreAlert = '';
    let messageAlert = '';
    let identifiant = '';
    let mdp = '';
    this.userService.getOneUser(this.mede.value.email, null).subscribe((response) => {
      if (response == true) {
        // this.errorMessage = 'email  existant';
        // window.alert(this.errorMessage)
        this.confirmationDialogSrv.alert('Info  ', 'Email existant').then((confirmed) => {}).catch(() => console.log('error'));
      } else {
        var newNom = this.tranformtext(this.mede.value.nom, this.mede.value.prenom)
        this.userService.createMedecin(this.mede.value, newNom, this.identifiant).subscribe(data => {
          this.userListe = data
          this.typeUser = 'medecin'
          this.addMedecin.nativeElement.click();
          // $(this.someModal.nativeElement).modal('show');
          identifiant = '- Identifiant : ' + this.userListe.user.identifiant
          mdp = '- Mot de passe : ' + this.userListe.motDePasse
          titreAlert = 'Succés '
          messageAlert = identifiant + " \n " + mdp

          this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => {  }).catch(() => console.log('error'));
          this.loading = true;
          this.mede.reset();
          this.submitted = false

        })
      }
    })
  }
  onUserLabo() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    if (this.labo.invalid) {
      this.labovalue = false
      return;
    } else {
      this.createUserLabo();
    }
  }
  private createUserLabo() {
    let titreAlert = '';
    let messageAlert = '';
    let identifiant = '';
    let mdp = '';
    this.userService.getOneUser(this.labo.value.email, null).subscribe((response) => {
      var newNom = this.tranformtext(this.labo.value.nom, this.labo.value.prenom)
      if (response == true) {
        // window.alert('email  existant')
        this.confirmationDialogSrv.alert('Info ', 'Email existant').then((confirmed) => {  }).catch(() => console.log('error'));
      }
      else {
        if (this.labo.value.role == 'userLabo') {
          this.userService.createUserLabo(this.labo.value, newNom, this.identifiant).subscribe(data => {
            this.userListe = data
            this.typeUser = 'user labo'
            this.addUserLabo.nativeElement.click();
            // $(this.someModal.nativeElement).modal('show');
            identifiant = '- Identifiant : ' + this.userListe.user.identifiant
            mdp = '- Mot de passe : ' + this.userListe.motDePasse
            titreAlert = 'Succés '
            messageAlert = identifiant + " \n " + mdp
            this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => {  }).catch(() => console.log('error'));
            this.loading = true;
            this.labo.reset()
            this.submitted = false
          })
        } else if (this.labo.value.role == 'adminLabo') {
          this.userService.createAdminLabo(this.labo.value, newNom, this.identifiant).subscribe(data => {
            this.userListe = data
            this.typeUser = 'administrateur  labo'
            this.addUserLabo.nativeElement.click();
            // $(this.someModal.nativeElement).modal('show');
            identifiant = '- Identifiant : ' + this.userListe.user.identifiant
            mdp = '- Mot de passe : ' + this.userListe.motDePasse
            titreAlert = 'Succés '
            messageAlert = identifiant + " \n " + mdp
            this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => { }).catch(() => console.log('error'));
            this.loading = true;
            this.labo.reset()
            this.submitted = false

          })
        } else if (this.labo.value.role == 'adminSilogik') {
          this.userService.createAdminSilogik(this.labo.value, newNom, this.identifiant).subscribe(data => {
            this.userListe = data
            this.typeUser = 'administrateur  Silogik'
            this.addUserLabo.nativeElement.click();
            // $(this.someModal.nativeElement).modal('show');
            identifiant = '- Identifiant : ' + this.userListe.user.identifiant
            mdp = '- Mot de passe : ' + this.userListe.motDePasse
            titreAlert = 'Succés '
            messageAlert = identifiant + " \n " + mdp

            this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => {  }).catch(() => console.log('error'));
            this.loading = true;
            this.labo.reset()
            this.submitted = false
          })
        } else {
          window.alert('user error')
        }
      }
    })
  }
  get f() {
    return this.form.controls;
  }
  get usermed() {
    return this.mede.controls;
  }
  get userlabo() {
    return this.labo.controls;
  }
  tranformtext(nom, prenom): string {
    if (nom == null && prenom == null) {
      return
    } else {
      const _nom = nom.substring(0, 1);
      const _prenom = prenom.substring(0, 1);
      var str = _nom.toUpperCase() + _prenom.toUpperCase()
      return str.substring()
    }


  }
  getpath(CompteRendu) {
    this.open = true;
    this.url = CompteRendu.path;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);


  }



}
