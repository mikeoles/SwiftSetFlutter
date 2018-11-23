import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss']
})
export class MissionViewComponent implements OnInit {
  mission: any;
  currentMisison: number;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        this.currentMisison = params['missionId'];
      }
    });
    this.apiService.getMission(this.currentMisison).subscribe(mission => this.mission = mission);
  }
}
