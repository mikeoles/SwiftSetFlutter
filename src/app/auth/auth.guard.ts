import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('returnUrl', state.url);
      this.router.navigate(['auth']);
      return false;
    }
    const roles = next.data.roles as Array<string>;
    let authorized = false;
    // If specific roles are applied to guard only allow those roles, if not allow all users
    if (roles) {
      roles.forEach(role => {
        if (this.authService.hasRole(role)) {
          authorized = true;
        }
      });
    } else {
      authorized = true;
    }

    if (!authorized) {
      this.router.navigate(['unauthorized']);
    }
    return true;
  }
}
