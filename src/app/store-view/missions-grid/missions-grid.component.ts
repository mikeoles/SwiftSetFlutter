import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-missions-grid',
  templateUrl: './missions-grid.component.html',
  styleUrls: ['./missions-grid.component.scss']
})
export class MissionsGridComponent implements OnInit {
  @Input() missions: any[];
  @Input() missionsDate: number;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewMission(missionId: number) {
    this.router.navigate(['mission/' + missionId]);
  }

}
