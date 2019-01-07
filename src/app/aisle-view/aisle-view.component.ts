import { Component, OnInit } from '@angular/core';
import { ApiService } from './../api.service';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import Mission from './../mission.model';
import Aisle from './../aisle.model';
import Label from './../label.model';

@Component({
  selector: 'app-aisle-view',
  templateUrl: './aisle-view.component.html',
  styleUrls: ['./aisle-view.component.scss'],
  providers: [ KeyboardShortcutsService ]
})

export class AisleViewComponent implements OnInit {
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
  panoTouched: boolean;

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

  hideDropdowns() {
    this.panoTouched = true;
  }

  setDisplay(display) {
    this.currentDisplay = display;
  }
}
