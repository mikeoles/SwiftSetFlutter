import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { LogoService } from './logo.service';
import { BackService } from './back.service';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ KeyboardShortcutsService ]
})
export class AppComponent implements OnInit {

  displayBackButton: boolean;

  faArrowAltCircleLeft = faArrowAltCircleLeft;

  constructor(private router: Router, private logoService: LogoService, private backService: BackService) {
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
      this.displayBackButton = false;
    } else {
      this.displayBackButton = true;
    }
  };
}
