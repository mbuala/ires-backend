import { Component, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'app/controller/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})


export class PatientguardGuard implements CanActivate {
  constructor( private router: Router , private tokenStorage: TokenStorageService){}

  canActivate(
    next : ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
   
    {
     if (this.tokenStorage.getToken()){
        if(this.tokenStorage.getUser().role == 'patient'){
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
