import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { Utilisateur } from 'app/controller/models/utilisateur.model';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { Router } from "@angular/router";
import { ViewChild, ElementRef } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AgGridModule } from 'ag-grid-angular';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { AlertService, } from 'app/controller/services/alert.service';
declare var $: any;



@Component({

  selector: 'app-gestion-compte',
  templateUrl: './gestion-compte.component.html',
  styleUrls: ['./gestion-compte.component.css']
})

export class GestionCompteComponent implements OnInit {
  User: Utilisateur = new Utilisateur();
  userListe: any = [] //LABO
  PatientListe: any = []
  MedecinListe: any = []
  patient: Utilisateur = new Utilisateur();
  @ViewChild('CloseDelete') CloseDelete: ElementRef;
  @ViewChild('CloseAdd') CloseAdd: ElementRef;
  @ViewChild('CloseUpdate') CloseUpdate: ElementRef;
  @ViewChild('loggedOut') loggedOut: ElementRef;
  @ViewChild('unlock') unlock: ElementRef;
  @ViewChild('Update') Update: ElementRef;
  @ViewChild('someModal') someModal: ElementRef;
  @ViewChild('Closeunlock') Closeunlock: ElementRef;
  loading = false;
  message: string
  title: string
  icon: string
  TailleListePatients : number
  TailleListeMedecins : number
  TailleListeLabo: number
  @ViewChild('addPatient') addPatient: ElementRef;
  @ViewChild('addMedecin') addMedecin: ElementRef;
  @ViewChild('addUserLabo') addUserLabo: ElementRef;
  //PAGINATION
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 20, 30, 50, 100];
  pageSizes = [];
  currentIndex = -1;
  pageSize = 10;
  typeUser: string
  currentElement: any ;
  submitted = false;
  logo = environment.url
  //PAGINATION
  formvalue: boolean = true
  //RECHERCHE
  filterTerm: string;
  MedecinfilterTerm: string
  LabofilterTerm: string
  role: string;
  identifiant: string;

    //version 2
    form: any = {};
    formMed: any = {};
    formLab: any = {};

  
  constructor(
    private restApi: UtilisateurService, public router: Router, private tokenStorage: TokenStorageService, private confirmationDialogSrv: ModalConfirmationService
  , private formBuilder: FormBuilder,  private alertService: AlertService,) { }

  ngOnInit(): void {
    this.role = this.tokenStorage.getUser().role;
    this.identifiant = this.tokenStorage.getUser().user.idUtilisateur;

    
    this.loadUsers();
    this.loadPatient();
    this.loadMedecin();
    
   
    
  }

  
  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    this.createUser();
    // if (!this.form.nom || !this.form.prenom) {
    //   console.log("gtgtgtgt")
    //   this.formvalue = false
    //   return;
    // } else {
    //   console.log("dddddd")
    //   //   this.formvalue=true
    //   return this.createUser();
    // }
  }
  private async createUser() {
   
    let titreAlert = '';
    let messageAlert = '';
    let identifiant = '';
    let mdp = '';
    var newNom = this.tranformtext(this.form.nom, this.form.prenom)
    this.restApi.getOneUser(this.form.email, this.form.ipp).subscribe((response) => {
      if (response == true) {
        // window.alert('email  existant')
        this.confirmationDialogSrv.alert('Info ', 'Email existant').then((confirmed) => { console.log('hey') }).catch(() => console.log('error'));
      } else {
        this.restApi.createPatient(this.form, newNom, this.identifiant).subscribe(data => {
          this.addPatient.nativeElement.click();
          this.userListe = data
          this.typeUser = 'patient'
          // $(this.someModal.nativeElement).modal('show');
          identifiant = '- Identifiant : ' + this.userListe.user.identifiant
          mdp = '- Mot de passe : ' + this.userListe.motDePasse
          titreAlert = 'Succés '
          messageAlert = identifiant + " \n " + mdp
          this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => { 
            this.loadPatient();
             }).catch(() => console.log('error'));
          this.loading = true;
          this.form = ""
          this.submitted = false
        })
      }
    })
  }

  onCreateMedecin() {
    this.submitted = true;
    this.alertService.clear();
    this.createMedecin();
   
  }
  private createMedecin() {
    let titreAlert = '';
    let messageAlert = '';
    let identifiant = '';
    let mdp = '';
    this.restApi.getOneUser(this.formMed.email, null).subscribe((response) => {
      if (response == true) {
        // this.errorMessage = 'email  existant';
        // window.alert(this.errorMessage)
        this.confirmationDialogSrv.alert('Info  ', 'Email existant').then((confirmed) => {  }).catch(() => console.log('error'));
      } else {
        var newNom = this.tranformtext(this.formMed.nom, this.formMed.prenom)
        this.restApi.createMedecin(this.formMed, newNom, this.identifiant).subscribe(data => {
          this.userListe = data
          this.typeUser = 'medecin'
          this.addMedecin.nativeElement.click();
          // $(this.someModal.nativeElement).modal('show');
          identifiant = '- Identifiant : ' + this.userListe.user.identifiant
          mdp = '- Mot de passe : ' + this.userListe.motDePasse
          titreAlert = 'Succés '
          messageAlert = identifiant + " \n " + mdp

          this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => {
            this.loadMedecin();
              }).catch(() => console.log('error'));
          this.loading = true;
      
          this.submitted = false

        })
      }
    })
  }
  onUserLabo() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    this.createUserLabo();
    
  }
  private createUserLabo() {
    let titreAlert = '';
    let messageAlert = '';
    let identifiant = '';
    let mdp = '';
    this.restApi.getOneUser(this.formLab.email, null).subscribe((response) => {
      var newNom = this.tranformtext(this.formLab.nom, this.formLab.prenom)
      if (response == true) {
        // window.alert('email  existant')
        this.confirmationDialogSrv.alert('Info ', 'Email existant').then((confirmed) => {  }).catch(() => console.log('error'));
      }
      else {
        if (this.formLab.role == 'userLabo') {
          this.restApi.createUserLabo(this.formLab, newNom, this.identifiant).subscribe(data => {
            this.userListe = data
            this.typeUser = 'user labo'
            this.addUserLabo.nativeElement.click();
            // $(this.someModal.nativeElement).modal('show');
            identifiant = '- Identifiant : ' + this.userListe.user.identifiant
            mdp = '- Mot de passe : ' + this.userListe.motDePasse
            titreAlert = 'Succés '
            messageAlert = identifiant + " \n " + mdp
            this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => { 
              this.loadUsers();
               }).catch(() => console.log('error'));
            this.loading = true;
           
            this.submitted = false
          })
        } else if (this.formLab.role == 'adminLabo') {
          this.restApi.createAdminLabo(this.formLab, newNom, this.identifiant).subscribe(data => {
            this.userListe = data
            this.typeUser = 'administrateur  labo'
            this.addUserLabo.nativeElement.click();
            // $(this.someModal.nativeElement).modal('show');
            identifiant = '- Identifiant : ' + this.userListe.user.identifiant
            mdp = '- Mot de passe : ' + this.userListe.motDePasse
            titreAlert = 'Succés '
            messageAlert = identifiant + " \n " + mdp
            this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => {  }).catch(() => console.log('error'));
            this.loading = true;
          
            this.submitted = false

          })
        } else if (this.formLab.role == 'adminSilogik') {
          this.restApi.createAdminSilogik(this.formLab, newNom, this.identifiant).subscribe(data => {
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
       
            this.submitted = false
          })
        } else {
          window.alert('user error')
        }
      }
    })
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
  loadUsers() {
    this.restApi.getAllUsers().subscribe((data: {}) => {

      this.userListe = data;
      this.TailleListeLabo = this.userListe.users.length
    
    })
  }
  loadPatient() {
    this.restApi.getPatient().subscribe(data => {
      this.PatientListe = data;
      this.TailleListePatients = this.PatientListe.patient.length
     
    })
  }
  onTableDataChange(event) {
    this.page = event;
    this.loadPatient();

  }
  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.loadPatient();

  }
  onTableChangeMedecin(event) {
    this.page = event;
    this.loadMedecin();
  }
  onTableSizeChangeMedecin(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.loadMedecin();

  }

  loadMedecin() {
    this.restApi.getMedecin().subscribe(data => {
      this.MedecinListe = data;
      this.pageSizes = [10, 20, 50,100]
      const totalItems = this.MedecinListe.count
      this.count = totalItems;
      this.TailleListeMedecins = this.MedecinListe.medecin.length


    })
  }
  setActiveElement(element, index): void {
    this.currentElement = element;
    this.currentIndex = index;
  }
  redirectInf(identifiant: String) {
    this.router.navigate((['/adminLabo/infoPatient', identifiant]));
  }

  updateUser() {
    this.confirmationDialogSrv.confirm('Modification', 'Êtes-vous sûr de vouloir modifier les informations ?').then((confirmed) => {
  
      this.restApi.updateUser(this.patient, this.identifiant)
      .subscribe(data => {
        this.Update.nativeElement.click();
        this.loading = true   
        this.confirmationDialogSrv.alert('Succès', 'Les inforamtions ont été modifié ').then((confirmed) => { 
      }).catch(() => console.log('error'));

      },
      err => {
  
        this.confirmationDialogSrv.alert('Erreur ', err.error.message).then((confirmed) => {}).catch(() => console.log('error'));
     }); 
    }).catch(() => console.log('error'));

  }
  debloquerUser(identifiant: any) {
    this.confirmationDialogSrv.confirm('Bloquer Compte  ', ' Êtes-vous sûr de vouloir bloquer ce compte ?').then((confirmed) => {
      this.restApi.bloquerUser(identifiant, this.identifiant).subscribe(data => {
        if (data) {
          this.ngOnInit();
          // this.CloseUpdate.nativeElement.click();
          this.loading = true
          this.confirmationDialogSrv.alert('Succès', 'Ce compte a été bloqué ').then((confirmed) => {  }).catch(() => console.log('error'));
        }
      })
    }).catch(() => console.log('error'));
  }
  bloquer(identifiant: any) {
  
    this.confirmationDialogSrv.confirm('Debloquer Compte  ', ' Êtes-vous sûr de vouloir debloquer ce compte ?').then((confirmed) => {
      this.restApi.bloquerUser(identifiant, this.identifiant).subscribe(data => {
        if (data) {
          this.ngOnInit();
          // this.Closeunlock.nativeElement.click();

          this.loading = true
          this.message = "vous avez bloqué l'utilisateur :" + identifiant
          this.title = 'DEBLOQUER'
          
          //  $(this.someModal.nativeElement).modal('show');
          this.confirmationDialogSrv.alert('Succès', 'Ce compte a été debloqué ').then((confirmed) => {  }).catch(() => console.log('error'));
        }
      })
    }).catch(() => console.log('error'));
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  deleteuser(idUser:any){
    this.confirmationDialogSrv.confirm('SUPPRESSION ', ' Êtes-vous sûr de vouloir Supprimer ce compte ?').then((confirmed) => {
      this.restApi.suppression(idUser,this.identifiant).subscribe(data=>{
     
          this.ngOnInit()
          this.confirmationDialogSrv.alert('Succès', 'Ce compte a été supprimé ').then((confirmed) => {  }).catch(() => console.log('error'));

      })
    }).catch(() => console.log('error'));
  }



}
