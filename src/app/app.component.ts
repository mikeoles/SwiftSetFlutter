import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LogoService } from './services/logo.service';
import { BackService } from './services/back.service';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from './auth/auth.service';
import { version } from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  displayBackButton: boolean;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  version: string = version;

  constructor(private router: Router,
              private logoService: LogoService,
              private backService: BackService,
              private authService: AuthService) {
    router.events.subscribe( (event) => ( event instanceof NavigationEnd ) && this.handleRouteChange() );
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
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
  }

  get username(): string {
    return this.authService.username();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth']);
  }
}
