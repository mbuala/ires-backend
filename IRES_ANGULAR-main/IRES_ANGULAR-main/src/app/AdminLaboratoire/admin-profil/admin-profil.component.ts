import { Component, NgModule, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { AuthService } from 'app/controller/services/auth.service';
import { UtilisateurService } from 'app/controller/services/utilisateur.service';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Utilisateur } from 'app/controller/models/utilisateur.model';
@Component({
  selector: 'app-admin-profil',
  templateUrl: './admin-profil.component.html',
  styleUrls: ['./admin-profil.component.css']
})


export class AdminProfilComponent implements OnInit {
  form: any = {};
  ischange = false;
  ischangeFailed = false;
  errorMessage = '';
  role: string;
  liste:any=[]
  hide = true;
  msg: any = {};
  newuserLabo: Utilisateur = new Utilisateur();
  Labo: any = [] //LABO
  currentUser: any;
  token: string;
  prenom: string;
  identifiant: string;
  updatelabo: FormGroup;
  isAdmin : boolean

  constructor(
    private formBuilder: FormBuilder, 
    private confirmationDialogSrv: ModalConfirmationService, 
    private restApi: UtilisateurService, 
    private authService: AuthService, 
    private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser().user.idUtilisateur;
    this.role = this.tokenStorage.getUser().role;
    this.identifiant = this.tokenStorage.getUser().user.identifiant;
    this.prenom = this.tokenStorage.getUser().user.prenom;
    this.restApi.getinfoUserLabo(this.identifiant).then(data => {
      this.Labo = data
      this.liste=this.Labo.data
    })
    this.updatelabo = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      ville: ['',],
      sexe: [''],
      cin: [''],
      adresse: [''],
      telephone: ['',],
      role: ['', Validators.required]
    });
  }
 
  Fermer(): void {
    this.ischange = false;
    this.authService.updatepassword(this.identifiant, this.form.oldPassword, this.form.newPassword).subscribe(
      data => {
        this.ischangeFailed = false;
        this.ischange = true;
        this.msg = data.message;
       
      },
      err => {
        this.errorMessage = err.error.message;
        this.ischangeFailed = true;
      }
    );
  }
  onSubmit(): void {
 
  }
  updatepasswod(): void {
    this.confirmationDialogSrv.confirm('Modification Mot passe', ' Êtes-vous sûr de vouloir modifier votre mot de passe ?')
      .then((confirmed) => {
        this.authService.updatepassword(this.identifiant, this.form.oldPassword, this.form.newPassword).subscribe
          (data => {
          
            this.form.oldPassword = "";
            this.form.newPassword = '';
            this.form.confirmPassw = '';
            this.confirmationDialogSrv.alert('Succés ', 'Votre mot de passe a bien été modifié').then((confirmed) => {              
            }).catch(() => console.log('error'));
          },
            err => {
             
              this.errorMessage = err.error.message;
           
              this.confirmationDialogSrv.alert('Erreur ', this.errorMessage).then((confirmed) => {}).catch(() => console.log('error'));
            }
          );
      }).catch(() => console.log('Annuler'));
  }
  onupdatelaboUserLabo() {
    this.confirmationDialogSrv.confirm('Modification ', ' Êtes-vous sûr de vouloir modifié vos Informations ?')
      .then((confirmed) => {
        this.newuserLabo = this.Labo.data
        
        this.restApi.updateUser(this.newuserLabo, this.currentUser)
        .subscribe(data => {
        
          this.ngOnInit()
          this.confirmationDialogSrv.alert('Succès', 'Les informations ont été modifiés ').then((confirmed) => {  }).catch();
        },
        err => {
            this.errorMessage = err.error.message;
        
          this.confirmationDialogSrv.alert('Info', this.errorMessage).then((confirmed) => {}).catch();
        }
        );
      })
      .catch(() => console.log('Annuler'));
    
  }


}
