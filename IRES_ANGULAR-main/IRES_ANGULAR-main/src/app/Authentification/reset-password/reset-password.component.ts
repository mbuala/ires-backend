import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/controller/services/auth.service';
import { environment } from 'environments/environment.prod';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {
  hide = true ;
  logo = environment.url
  form: any = {};
  errorMessage = '';
  isChangeFailed = false;
  email = '';
  msg: any= {};
  passwordchange = false;
  resettoken : string;
  constructor(private authService: AuthService, private route: ActivatedRoute, private _router: Router) { }

 ngOnInit(): void {
    this.resettoken= this.route.snapshot.paramMap.get('resettoken');
    }

  onSubmit(): void {
    this.authService.changepassword(this.resettoken, this.form.password ).subscribe(
      data => {
        this.isChangeFailed= false;
        this.passwordchange  = true;
                this.msg = data.message;
                setTimeout(() => {
                  this._router.navigate(['/']);
              }, 3000);  
  },
      err => {
        this.errorMessage = err.error.message;
        this.isChangeFailed = true;
        }
      
    );
  }
}
