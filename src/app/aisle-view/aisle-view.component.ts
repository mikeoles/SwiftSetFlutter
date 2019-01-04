import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-aisle-view',
  templateUrl: './aisle-view.component.html',
  styleUrls: ['./aisle-view.component.scss']
})
export class AisleViewComponent implements OnInit {
  title = 'aisle';
  outs: any[];
  labels: any[];
  missions: any[];
  aisles: any[];
  currentMission: number;
  currentAisle: string;
  currentId: number;
  currentDisplay: string;

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService) {
    this.currentDisplay = 'outs';
  }

  ngOnInit() {
    this.apiService.getMissions().subscribe(missions => this.missions = missions);
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        this.currentMission = params['missionId'];
      }
      if (params['aisleId'] !== undefined) {
        this.currentAisle = params['aisleId'];
      }
    });
    this.apiService.getMission(this.currentMission).subscribe(mission => this.aisles = mission.Aisles);
    this.setAisle(this.currentAisle);
  }

  setMission(id) {
    this.currentMission = id;
    this.apiService.getMission(this.currentMission).subscribe(mission => this.aisles = mission.Aisles);
    this.setAisle(this.aisles[0].AisleId);
  }

  setAisle(id) {
    this.currentAisle = id;
    this.apiService.getOuts(this.currentAisle).subscribe(outs => this.outs = outs);
    this.apiService.getLabels(this.currentAisle).subscribe(labels => this.labels = labels);
  }

  setId(id) {
    this.currentId = id;
  }

  setDisplay(display) {
    this.currentDisplay = display;
  }
}

