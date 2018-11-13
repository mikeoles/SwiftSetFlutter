import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aisle';
  outs: any[];
  labels: any[];
  missions: any[];
  aisles: any[];
  currentMission: number;
  currentAisle: string;
  currentId: number;
  currentDisplay: string;
  panoramaUrl: string;

  constructor(private apiService: ApiService) {
    this.currentDisplay = 'outs';
  }

  ngOnInit() {
    this.apiService.getMissions().subscribe(missions => {
      this.missions = missions;
      this.setMission(this.missions[0].Id);
    });
  }

  setMission(id) {
    this.currentMission = id;
    this.apiService.getAisles(id).subscribe(aisles => {
      this.aisles = aisles;
      this.setAisle(this.aisles[0].Id);
    });
  }

  setAisle(id) {
    this.currentAisle = id;
    this.apiService.getPanoramaUrl(this.currentMission, this.currentAisle).subscribe(url => this.panoramaUrl = url);
    this.apiService.getOuts(this.currentMission, this.currentAisle).subscribe(outs => this.outs = outs);
    this.apiService.getLabels(this.currentMission, this.currentAisle).subscribe(labels => this.labels = labels);
  }

  setId(id) {
    this.currentId = id;
  }

  setDisplay(display) {
    this.currentDisplay = display;
  }
}
