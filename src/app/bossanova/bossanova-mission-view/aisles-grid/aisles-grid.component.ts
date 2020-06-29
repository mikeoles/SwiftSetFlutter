import { Component, OnInit, Input, OnChanges } from '@angular/core';
import Aisle from '../../../models/aisle.model';
import { EnvironmentService } from 'src/app/services/environment.service';
import { faAngleDown, faAngleUp, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Role } from 'src/app/auth/role';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { AuditQueueStatus } from '../../audit-queue-status';

@Component({
  selector: 'app-aisles-grid',
  templateUrl: './aisles-grid.component.html',
  styleUrls: ['./aisles-grid.component.scss']
})
export class AislesGridComponent implements OnInit {

  @Input() aisles: Aisle[];
  @Input() missionId: string;
  @Input() storeId: string;
  @Input() addAllClicked: string;

  sortType = 'aisleName';
  sortReverse = false;
  aisleGridCounts = [];
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faExclamationTriangle = faExclamationTriangle;

  constructor(private environment: EnvironmentService, private authService: AuthService,
    private apiSerivce: ApiService) {
  }

  ngOnInit() {
    this.aisleGridCounts = this.environment.config.aisleGridCounts;
  }

  sortBy(type: string) {
    if (this.sortType === type) {
      this.sortReverse = !this.sortReverse;
    }
    this.sortType = type;
  }

  sortAisles() {
    if (this.sortReverse) {
      return this.aisles.sort((a, b) => a[this.sortType] < b[this.sortType] ? 1 : a[this.sortType] === b[this.sortType] ? 0 : -1);
    }
    return this.aisles.sort((a, b) => a[this.sortType] > b[this.sortType] ? 1 : a[this.sortType] === b[this.sortType] ? 0 : -1);
  }

  auditManager(): boolean {
    return this.authService.hasRole(Role.AUDIT_MANAGER);
  }

  auditor(): boolean {
    return this.authService.hasRole(Role.AUDITOR);
  }

  queueAisle(aisleId: string) {
    this.apiSerivce.queueAisle(this.storeId, this.missionId, aisleId);
    this.aisles.find(l => l.aisleId === aisleId).auditQueueStatus = AuditQueueStatus.QUEUED;
  }

  // Only display the problem coulmn if at least one aisle has a problem
  hasProblems() {
    let hasProblems = false;
    this.aisles.forEach(aisle => {
      if (aisle.missingPreviouslySeenBarcodePercentage > this.environment.config.missingPreviosulySeenThreshold) {
        hasProblems = true;
      }
    });
    return hasProblems;
  }

  // reformat count variable to readable header: sectionLabelCount -> Section Label Count
  formatHeader(countName: string) {
    if (countName === 'labelUnreadCount') {
      return 'Misread Barcodes';
    }
    let result = countName.replace( /([A-Z])/g, ' $1' );
    result = result.charAt(0).toUpperCase() + result.slice(1);
    result = result.substring(0, result.length - 6);
    return result += 's';
  }
}
