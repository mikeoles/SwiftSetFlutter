import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import Mission from 'src/app/models/mission.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/auth/role';
import { ApiService } from 'src/app/services/api.service';
import { AuditQueueStatus } from 'src/app/bossanova/audit-queue-status';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-missions-grid',
  templateUrl: './missions-grid.component.html',
  styleUrls: ['./missions-grid.component.scss']
})
export class MissionsGridComponent implements OnInit {
  @Input() missions: Mission[];
  @Input() missionsDate: number;
  @Input() averageStoreOuts: number;
  @Input() averageStoreLabels: number;
  @Input() storeId: string;
  @Input() storeId: number;
  faExclamationTriangle = faExclamationTriangle;

  constructor(private router: Router,
    public dataService: DataService,
    private authService: AuthService,
    private apiService: ApiService) { }

  ngOnInit() {
  }

  viewMission(missionId: number) {
    this.router.navigate(['store/' + this.storeId + '/mission/' + missionId]);
    this.dataService.averageStoreOuts = this.averageStoreOuts;
    this.dataService.averageStoreLabels = this.averageStoreLabels;
  }

  // Show the queue button if there are any aisle in the mission that can be queued
  hasUnqueuedAisles(missionId: string) {
    let hasUnqueuedAisles = false;
    const mission = this.missions.find(m => m.missionId === missionId);
    mission.aisles.forEach(aisle => {
      if (aisle.auditQueueStatus === null) {
        hasUnqueuedAisles = true;
      }
    });
    return hasUnqueuedAisles;
  }

  auditManager(): boolean {
    return this.authService.hasRole(Role.AUDIT_MANAGER);
  }

  // Queue each aisle for a mission that hasn't already been queued
  queueMission(missionId: string) {
    const mission = this.missions.find(m => m.missionId === missionId);
    this.apiService.queueMission(mission.storeId, mission.missionId);
    mission.aisles.forEach(aisle => {
      if (aisle.auditQueueStatus === null) {
        aisle.auditQueueStatus = AuditQueueStatus.QUEUED;
      }
    });

    // Only display the problem coulmn if at least one mission has a problem
  hasProblems() {
    let hasProblems = false;
    this.missions.forEach(mission => {
      if (mission.hasPreviouslySeenIssue) {
        hasProblems = true;
      }
    });
    return hasProblems;
  }
}
