import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentService } from '../environment.service';
import { AuthService } from '../auth.service';
import { UrlService } from '../url.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router,
              private environment: EnvironmentService,
              private authService: AuthService,
              private url: UrlService) { }

  ngOnInit() {
    const curUrlTree = this.router.parseUrl(this.router.url);
    const code: string = curUrlTree.queryParamMap.get('code');
    const state: string = curUrlTree.queryParamMap.get('state');
    if (code && code.length > 0) {
      if (state === this.retrieveState()) {
        this.authService.authenticate(code, this.getRedirectUrl()).subscribe(authData => {
          this.navigateToReturnUrl();
        });
        return;
      }
    }

    if (this.authService.isTokenExpired()) {
      this.authService.refresh().subscribe(_ => {
        this.navigateToReturnUrl();
      });
    } else if (!this.authService.isLoggedIn()) {
      this.url.location.href =  this.environment.config.authUrl +
          `client_id=${this.environment.config.authClientId}&` +
          `redirect_uri=${encodeURIComponent(this.getRedirectUrl())}&` +
          'response_type=code&' +
          'scope=openid+profile+email+offline_access+groups&' +
          `state=${this.createState()}`;
    }
  }

  navigateToReturnUrl() {
    this.router.navigateByUrl(localStorage.getItem('returnUrl') || '/');
    localStorage.removeItem('returnUrl');
  }

  private createState(): string {
    const state = Math.random().toString();
    localStorage.setItem('authState', state);
    return state;
  }

  private retrieveState(): string {
    const state = localStorage.getItem('authState');
    localStorage.removeItem('authState');
    return state;
  }

  private getRedirectUrl(): string {
    return `${this.url.location.origin}${this.url.location.pathname}`;
  }
}
