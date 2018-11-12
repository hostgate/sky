import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
@Injectable()
export class CanEditGuard implements CanActivate {
  constructor(private jwt:JwtHelper,private router: Router){}
  public token: string;
  public level_id:number;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        if(this.token){
            this.level_id=this.jwt.decodeToken(this.token ).data.level_id;
        }
        if (this.level_id<3) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
  }
}
