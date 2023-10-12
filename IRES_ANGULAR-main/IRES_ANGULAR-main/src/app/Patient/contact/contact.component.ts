import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/controller/services/auth.service';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  // url: string = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212.2967851141655!2d-7.99997322471424!3d31.640734081103755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef2f71d1012f%3A0xd444c8983642f6ee!2sEspace%20Assafwa!5e0!3m2!1sfr!2sus!4v1623236659654!5m2!1sfr!2sus"
  urlSafe: SafeResourceUrl;
  identifiant : string ;
  alert : boolean =false ;
  currentUser: any ;
  form: any = {};
  
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,private _router: Router, public sanitizer: DomSanitizer, private confirmationDialogSrv: ModalConfirmationService) { }

  ngOnInit(): void {
    // this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.currentUser = this.tokenStorage.getUser().user;
    this.identifiant = this.currentUser.identifiant;
  }
   onSubmit(): void {
    let message = ' Êtes-vous sûr de vouloir envoyer ce message ? ' 
    let titre= 'Envoie Message '
    let titreAlert = '';
    let messageAlert = '';
    this.confirmationDialogSrv.confirm(titre, message).then((confirmed) =>{
      this.authService.contact(this.identifiant ,this.form.message).subscribe(
        data => {
          titreAlert = 'Succés '
          messageAlert = 'Votre message a bien été envoyé'
          this.confirmationDialogSrv.alert(titreAlert, messageAlert).then((confirmed) => { 
            this.form.message=""
            }).catch(() => console.log('error'));
                },
        err => {
          console.log(err);
          titreAlert = 'Erreur '
          this.confirmationDialogSrv.alert(titreAlert, err).then((confirmed) => { 
           }).catch(() => console.log('error'));
        }
      );
    })
  .catch(() => console.log('Annuler'));
  }
 

}
