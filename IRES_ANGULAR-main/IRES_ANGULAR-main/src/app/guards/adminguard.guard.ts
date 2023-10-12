import { Component, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from '../Authentification/login/login.component';
import { TokenStorageService } from 'app/controller/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})


export class AdminguardGuard implements CanActivate {
  
  constructor(private auth: LoginComponent , private router: Router , private tokenStorage: TokenStorageService){}

  canActivate(
    next : ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
     if (this.tokenStorage.getToken()){
        if(this.tokenStorage.getUser().role == 'labo' || this.tokenStorage.getUser().role == 'adminSilogik' || this.tokenStorage.getUser().role == 'userLabo' ){
        return true;
        }
        else 
        return false;
      }
      else {
       this.router.navigate(['/login']);
  }
}
}
