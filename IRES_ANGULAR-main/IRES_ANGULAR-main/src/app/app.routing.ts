import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './Authentification/login/login.component';
import { ResetPasswordComponent } from './Authentification/reset-password/reset-password.component';
import { EmailResetPassComponent } from './Authentification/email-reset-pass/email-reset-pass.component';
import { DashboardComponent } from './AdminLaboratoire/dashboard/dashboard.component';
import { LoginguardGuard } from 'app/guards/loginguard.guard';


const routes: Routes =[
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, 
  { path: 'test', component: TestComponent },
  { path: 'login', component: LoginComponent , canActivate: [LoginguardGuard] }, 
  { path: 'resetpassword/:resettoken', component: ResetPasswordComponent},
  { path: 'emailresetPass', component: EmailResetPassComponent},
   {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
