import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AdalService } from 'adal-angular4';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private adal: AdalService) { }

  canActivate(): boolean {

    if (this.adal.userInfo.authenticated) {
      return true;
    }

    this.adal.login();

    return false;
  }
}
