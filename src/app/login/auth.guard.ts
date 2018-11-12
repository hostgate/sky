import { Injectable } from '@angular/core';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from "../local-storage.service";
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.lsService.getStorage('currentUser')) {
      return true;
    }
    this.router.navigate(['/התחברות']);
    return false;
  }
  constructor(private router: Router,private lsService:LocalStorageService) { }
}
