import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/controller/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { FormsModule } from '@angular/forms'; 
import { MatTabsModule } from '@angular/material/tabs'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { environment } from 'environments/environment.prod';
@Component({
  selector: 'app-email-reset-pass',
  templateUrl: './email-reset-pass.component.html',
  styleUrls: ['./email-reset-pass.component.css']
})

export class EmailResetPassComponent implements OnInit {
  logo = environment.url
  form: any = {};
  errorMessage = '';
  isEnvoieFailed = false;
  email = '';
  msg: any= {};
  emailEnvoye = false;

  constructor(private authService: AuthService,private _router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.emailReset(this.form).subscribe(
      data => {
        this.isEnvoieFailed = false;
        this.emailEnvoye = true;
                this.msg = data.message;
                setTimeout(() => {
                  this._router.navigate(['/']);
              }, 3000); 
      },
      err => {
        this.errorMessage = err.error.message;
        this.isEnvoieFailed = true;
     

      }
      
    );
  }
}
