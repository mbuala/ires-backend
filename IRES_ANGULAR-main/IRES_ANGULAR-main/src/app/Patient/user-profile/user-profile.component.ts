import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { AuthService } from 'app/controller/services/auth.service';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})


export class UserProfileComponent implements OnInit {
  hide1 = true ;
  hide2 = true ;
  hide3 = true ;
  form: any = {};
  errorMessage = '';
  role: string ;
  identifiant: string ;
  specialite: any = [];
  ipp : string;
  isPatient : boolean;
  user:any;
  dateNaissance : string;
  pipe = new DatePipe('en-US');

 


  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,  private confirmationDialogSrv: ModalConfirmationService) {}

  ngOnInit(): void {
        this.role = this.tokenStorage.getUser().role;
        this.identifiant=this.tokenStorage.getUser().user.identifiant;
        this.getUser();
                   }

  updatepasswod(): void {
          this.confirmationDialogSrv.confirm('Modification Mot passe',' Êtes-vous sûr de vouloir modifier votre mot de passe ?' )
          .then((confirmed) => {   
           
                       this.authService.updatepassword(this.identifiant, this.form.oldPassword, this.form.newPassword)
                       .subscribe(data => {
                              
                                this.confirmationDialogSrv.alert('Succés ', 'Votre mot de passe a bien été modifié').then((confirmed) => {
                                  this.form.oldPassword = "";
                                   this.form.newPassword = '';
                                   this.form.confirmPassw = '';
                                 
                                }).catch(() => console.log('error'));
                      
                               },
                      err => {
                                this.errorMessage = err.error.message;
                      
                                this.confirmationDialogSrv.alert('Erreur ', this.errorMessage).then((confirmed) => {}).catch(() => console.log('error'));
                             });
                             } )
          .catch(() => console.log('Annuler'));
    
     
                       }
    

  getUser(): void {
    if(this.role =='patient')
            {
              this.isPatient =  true;
              this.authService.profilePatient(this.identifiant).subscribe(
                      data => {
                          this.user=data.user
                          this.ipp=data.patient.ipp
                         
                          this.dateNaissance = this.pipe.transform(data.user.dateNaissance, 'dd-MM-yyyy');    
                      },
                      err => {
                        this.errorMessage = err.error.message;
                      }
              );
            }
    else
            {
              this.isPatient =  false;
              this.authService.profileMedecin(this.identifiant).subscribe(
                      data => {
                          this.user=data.user
                          this.specialite=data.medecin.specialite
                      },
                      err => {
                            this.errorMessage = err.error.message;
                          }
              );
            }
                  } 
}




