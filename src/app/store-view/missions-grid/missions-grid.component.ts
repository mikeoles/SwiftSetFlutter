import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import MissionSummary from 'src/app/missionSummary.model';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-missions-grid',
  templateUrl: './missions-grid.component.html',
  styleUrls: ['./missions-grid.component.scss']
})
export class MissionsGridComponent implements OnInit {
  @Input() missionSummaries: MissionSummary[];
  @Input() missionsDate: number;
  @Input() averageStoreOuts: number;
  @Input() averageStoreLabels: number;

  constructor(private router: Router, public dataService: DataService) { }

  ngOnInit() {
  }

  viewMission(missionId: number) {
    this.router.navigate(['mission/' + missionId]);
    this.dataService.averageStoreOuts = this.averageStoreOuts;
    this.dataService.averageStoreLabels = this.averageStoreLabels;
  }

}
