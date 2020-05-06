import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/role';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss']
})
export class MissionViewComponent {

  constructor(private authService: AuthService) {
  }

  customer(): boolean {
    return this.authService.hasRole(Role.CUSTOMER);
  }

  bossanova(): boolean {
    return this.authService.hasRole(Role.BOSSANOVA);
  }
}
