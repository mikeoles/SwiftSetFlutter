import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import Mission from 'src/app/mission.model';

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

  constructor(private router: Router, public dataService: DataService) { }

  ngOnInit() {
  }

  viewMission(missionId: number) {
    this.router.navigate(['store/' + this.storeId + '/mission/' + missionId]);
    this.dataService.averageStoreOuts = this.averageStoreOuts;
    this.dataService.averageStoreLabels = this.averageStoreLabels;
  }

}
