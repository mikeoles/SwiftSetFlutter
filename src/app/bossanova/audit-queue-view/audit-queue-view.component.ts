import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Aisle from 'src/app/models/aisle.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/auth/role';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-queue-view',
  templateUrl: './audit-queue-view.component.html',
  styleUrls: ['./audit-queue-view.component.scss']
})
export class AuditQueueViewComponent implements OnInit {

  aisles: Aisle[];

  constructor(private apiSerivce: ApiService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.apiSerivce.getAuditQueue().subscribe(aisle => {
      this.aisles = aisle;
    });
  }

  removeAisle(aisle: Aisle) {
    this.apiSerivce.removeQueuedAisle(aisle);
    const index: number = this.aisles.findIndex(a => a.aisleId === aisle.aisleId);
    if (index !== -1) {
        this.aisles.splice(index, 1);
    }
  }

  auditAisle(aisle: Aisle) {
    this.apiSerivce.auditAisle(aisle);
    this.router.navigate(['store/' + aisle.storeId + '/mission/' + aisle.missionId + '/aisle/' + aisle.aisleId + '/audit']);
  }

  auditManager(): boolean {
    return this.authService.hasRole(Role.AUDIT_MANAGER);
  }

  auditor(): boolean {
    return this.authService.hasRole(Role.AUDITOR);
  }
}
