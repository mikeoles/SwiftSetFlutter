import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ KeyboardShortcutsService ]
})
export class AppComponent implements OnInit {
  title = 'aisle';
  outs: Label[];
  labels: Label[];
  missions: Mission[];
  selectedMission: Mission;
  aisles: Aisle[];
  selectedAisle: Aisle;
  currentId: number;
  currentDisplay: string;
  panoramaUrl: string;
  panoMode: boolean;

  constructor(private apiService: ApiService, private keyboard: KeyboardShortcutsService) {
    this.currentDisplay = 'outs';
    this.panoMode = false;
    this.keyboard.add([
         {
             key: 'ctrl o',
             command: () => this.changePanoMode(),
             preventDefault: true
            }
     ]);
    }

  ngOnInit() {
    this.apiService.getMissions().subscribe(missions => {
      this.missions = missions;
      this.setMission(this.missions[0]);
    });
  }

  changePanoMode(): any {
    this.panoMode = !this.panoMode;
    // Export panomode to grid and hide grid class based on it
    // change size of pano based on it
  }

  setMission(mission: Mission) {
    this.selectedMission = mission;
    this.apiService.getAisles(mission.id).subscribe(aisles => {
      this.aisles = aisles;
      this.setAisle(this.aisles[0]);
    });
  }

  setAisle(aisle) {
    this.selectedAisle = aisle;
    this.apiService.getAisle(aisle.id).subscribe(fullAisle => {
      this.outs = fullAisle.outs;
      this.labels = fullAisle.labels;
      this.panoramaUrl = fullAisle.panoramaUrl;
      this.currentDisplay = 'outs';
      this.currentId = null;
    });
  }

  setId(id) {
    this.currentId = id;
  }

  setDisplay(display) {
    this.currentDisplay = display;
  }
}
