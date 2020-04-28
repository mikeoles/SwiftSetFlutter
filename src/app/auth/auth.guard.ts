import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Role } from './role';

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
    // If specific roles are applied to guard only allow those roles, if not allow all users
    if (roles && !roles.some(role => this.authService.hasRole(role))) {
      this.router.navigate(['unauthorized']);
      return false;
    }
    return true;
  }
}
