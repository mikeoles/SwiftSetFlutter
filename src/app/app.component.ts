import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { LogoService } from './logo.service';
import { BackService } from './back.service';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { ApiService } from './api.service';
import { Roles } from '../permissions/roles';
import { EnvironmentService } from './environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ KeyboardShortcutsService ]
})
export class AppComponent implements OnInit {

  displayBackButton: boolean;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  permissionsSet: Promise<boolean>;

  constructor(@Inject('ApiService') private apiService: ApiService, private router: Router, private logoService: LogoService,
    private backService: BackService, private environment: EnvironmentService) {
    router.events.subscribe( (event) => ( event instanceof NavigationEnd ) && this.handleRouteChange() );
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
      if (this.environment.config.authUsers) {
        this.authenticateUser();
      }
    });
  }

  logoClicked() {
    this.logoService.logoClick();
  }

  backClicked() {
    this.backService.backClick();
  }

  handleRouteChange = () => {
    if (this.router.url.includes('store')) {
      this.displayBackButton = true;
    } else {
      this.displayBackButton = false;
    }
    this.permissionsSet = Promise.resolve(true);
  }

  authenticateUser() {
    const curUrlTree = this.router.parseUrl(this.router.url);
    const code: string = curUrlTree.queryParamMap.get('code');
    let state: string = curUrlTree.queryParamMap.get('state');
    if (code && code.length > 0) {
      if (state === localStorage.getItem('state')) {
        localStorage.setItem('access_code', code);
      }
    } else if (!localStorage.getItem('access_code')) {
      state = Math.random().toString();
      window.location.href =  this.environment.config.authUrl +
      'client_id=example-app&' +
      'redirect_uri=http%3A%2F%2Flocalhost%3A4200&' +
      'response_type=code&scope=openid+profile+email+offline_access+groups' +
      '&state=' + state;
      localStorage.setItem('state', state);
    } else if (!localStorage.getItem('access_token') || !localStorage.getItem('id_token')) {
      this.apiService.getTokens(localStorage.getItem('access_code')).subscribe( tokens => {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('id_token', tokens.id_token);
        this.apiService.getRoles(localStorage.getItem('id_token')).subscribe( role => {
          this.environment.setPermissons(Roles[role]);
          this.permissionsSet = Promise.resolve(true);
        });
      });
    } else {
      this.apiService.getRoles(localStorage.getItem('id_token')).subscribe( role => {
        this.environment.setPermissons(Roles[role]);
        this.permissionsSet = Promise.resolve(true);
      });
    }
  }
}
