import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { LogoService } from './logo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ KeyboardShortcutsService ]
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private logoService: LogoService) { }

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
}
