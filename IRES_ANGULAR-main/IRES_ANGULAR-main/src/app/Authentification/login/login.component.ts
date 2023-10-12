import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/controller/services/auth.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationService } from 'app/controller/services/modal-confirmation.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    logo = environment.url
    form: any = {};
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    role: string ;
    hide = true;
    hide1 = true;
    MdpActuel : string ;
    constructor(private authService: AuthService, private tokenStorage: TokenStorageService,private _router: Router, private modalFirstLogin: NgbModal, private confirmationDialogSrv: ModalConfirmationService) { }

    ngOnInit(): void {
      // recuperer le role de l'utilisateur connecté
        if (this.tokenStorage.getToken()) {
          this.isLoggedIn = true;
          this.role = this.tokenStorage.getUser().role;
        }
    }
    onSubmit(content): void {
      localStorage.clear();
      this.authService.login(this.form.identifiant, this.form.password).subscribe(
        data => {
          if(data.user.isConnected == false){
            this.MdpActuel= this.form.password
              this.modalFirstLogin.open(content, { windowClass : 'modal-center' });
          }
          else{
                this.tokenStorage.saveToken(data.token);
                this.tokenStorage.saveUser(data);
                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.role = this.tokenStorage.getUser().role;
                if(this.role == 'patient'){
                  this._router.navigate(['/patient/resultatsCRR']);
                  }
                  else if(this.role == 'medecin'){
                    this._router.navigate(['/medecin/ResultatsPatients']);
                  }
                  else{
                    this._router.navigate(['/adminLabo/dashboard']);
                  }
              }
              },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    }
    changerMdp(): void{
      if (this.form.nvpassword == this.MdpActuel){
        this.confirmationDialogSrv.alert('Erreur ', 'Le nouveau mot de passe doit etre different de l \'ancien ').then((confirmed) => { }).catch( );
      }
      else{
        this.authService.changeMdpFirstLogin(this.form.identifiant, this.form.nvpassword).subscribe(
          data => {
            this.authService.login(this.form.identifiant, this.form.nvpassword).subscribe(
              data => {
                      this.tokenStorage.saveToken(data.token);
                      this.tokenStorage.saveUser(data);
                      this.isLoginFailed = false;
                      this.isLoggedIn = true;
                      this.role = this.tokenStorage.getUser().role;
                      if(this.role == 'patient' || this.role == 'medecin' ){
                        this._router.navigate(['/patient/user-profile']);
                        }
                        else{
                          this._router.navigate(['/adminLabo/dashboard']);
                        }

                    },
              err => {
                this.errorMessage = err.error.message;
                this.isLoginFailed = true;
              }
            );
            },
          err => {
            this.errorMessage = err.error.message;
        }
        );
      }

    }
 }