import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import Mission from 'src/app/models/mission.model';
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
  @Input() storeId: number;
  faExclamationTriangle = faExclamationTriangle;

  constructor(private router: Router, public dataService: DataService) { }

  ngOnInit() {
  }

  viewMission(missionId: number) {
    this.router.navigate(['store/' + this.storeId + '/mission/' + missionId]);
    this.dataService.averageStoreOuts = this.averageStoreOuts;
    this.dataService.averageStoreLabels = this.averageStoreLabels;
  }

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
