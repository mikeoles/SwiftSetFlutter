import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/role';

@Component({
  selector: 'app-fleet-view',
  templateUrl: './fleet-view.component.html',
  styleUrls: ['./fleet-view.component.scss']
})
export class FleetViewComponent {

  constructor(private authService: AuthService) {
  }

  customer(): boolean {
    return this.authService.hasRole(Role.CUSTOMER);
  }

  bossanova(): boolean {
    return this.authService.hasRole(Role.BOSSANOVA);
  }
}
