import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { TokenStorageService } from 'app/controller/services/token-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedecinGuard implements CanActivate {
  constructor( private router: Router , private tokenStorage: TokenStorageService){}

  canActivate(
    next : ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
   
    {
      if (this.tokenStorage.getToken()){
        if(this.tokenStorage.getUser().role == 'medecin'){
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
