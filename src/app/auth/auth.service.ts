import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import AuthData from '../models/auth.model';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService) { }

  public authenticate(code: string, redirectUrl: string): Observable<AuthData> {
    return this.apiService.getToken(code, redirectUrl)
        .pipe(
          tap(this.saveAuthData)
        );
  }

  public refresh(): Observable<AuthData> {
    const authData = this.getAuthData();

    if (!authData) {
      throwError('No refresh token.');
    }

    return this.apiService.refreshToken(authData.refreshToken)
        .pipe(
          tap(this.saveAuthData)
        );
  }

  public logout() {
    localStorage.removeItem('authData');
  }

  public getAuthData(): AuthData {
    const data = localStorage.getItem('authData');
    if (data === null) {
      return null;
    }
    const authData: AuthData = JSON.parse(data);
    authData.expiresAt = moment(authData.expiresAt);
    return authData;
  }

  public isLoggedIn(): boolean {
    const authData = this.getAuthData();

    return authData && authData.expiresAt.isAfter(moment());
  }

  public isTokenExpired(): boolean {
    const authData = this.getAuthData();

    return authData && authData.expiresAt.isBefore(moment());
  }

  public username(): string {
    const authData = this.getAuthData();
    if (!authData) {
      return null;
    }

    const helper = new JwtHelperService();
    const data = helper.decodeToken(authData.idToken);

    return data.name;
  }

  public hasRole(role: string): boolean {
    const authData = this.getAuthData();
    if (!authData || !authData.roles) {
      return false;
    }

    return authData.roles.includes(role);
  }

  private saveAuthData(authData: AuthData) {
    localStorage.setItem('authData', JSON.stringify(authData));
  }
}
