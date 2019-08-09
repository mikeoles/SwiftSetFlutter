import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { LogoService } from './logo.service';
import { BackService } from './back.service';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { AdalService } from 'adal-angular4';
import { EnvironmentService } from './environment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ KeyboardShortcutsService ]
})
export class AppComponent implements OnInit {

  displayBackButton: boolean;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  location: Location;

  constructor(private router: Router, private logoService: LogoService, private backService: BackService, public adalSvc: AdalService,
    private environment: EnvironmentService, private loc: Location) {
    router.events.subscribe( (event) => ( event instanceof NavigationEnd ) && this.handleRouteChange() );
    this.location = loc;
    this.adalSvc.init(environment.config.adalConfig);
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.adalSvc.handleWindowCallback();
    this.adalSvc.getUser();
    const context = this;
    if (!this.adalSvc.userInfo.authenticated) {
       this.adalSvc.login();
       localStorage.setItem('previousLocation', this.location.path());
    } else if (this.adalSvc.userInfo.authenticated && !localStorage.getItem('token')) {
      this.adalSvc.acquireToken('https://graph.microsoft.com').subscribe(act => {
        localStorage.setItem('token', act);
        if (localStorage.getItem('previousLocation').length > 0) {
          context.router.navigate([localStorage.getItem('previousLocation')]);
        } else {
          location.reload();
        }
      });
    }
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
  }
}
