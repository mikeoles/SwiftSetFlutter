import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import MissionSummary from 'src/app/missionSummary.model';

@Component({
  selector: 'app-missions-grid',
  templateUrl: './missions-grid.component.html',
  styleUrls: ['./missions-grid.component.scss']
})
export class MissionsGridComponent implements OnInit {
  @Input() missionSummaries: MissionSummary[];
  @Input() missionsDate: number;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewMission(missionId: number) {
    this.router.navigate(['mission/' + missionId]);
  }

}
