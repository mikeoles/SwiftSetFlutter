import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../api.service';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import Mission from './../mission.model';
import Aisle from './../aisle.model';
import Label from './../label.model';
import { ViewEncapsulation } from '@angular/core';
import { LogoService } from '../logo.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-aisle-view',
  templateUrl: './aisle-view.component.html',
  styleUrls: ['./aisle-view.component.scss'],
  providers: [ KeyboardShortcutsService ],
  encapsulation: ViewEncapsulation.None
})

export class AisleViewComponent implements OnInit, OnDestroy {
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
  resetPano: boolean;

  private logoSubscription: Subscription;

  constructor(private apiService: ApiService,
              private keyboard: KeyboardShortcutsService,
              private logoService: LogoService,
              private activatedRoute: ActivatedRoute,
              private location: Location) {
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
    this.logoSubscription = this.logoService.logoClickEvent().subscribe(() => this.changePanoMode());

    const missionId: number = Number(this.activatedRoute.params._value['missionId']);
    const aisleId: number = Number(this.activatedRoute.params._value['aisleId']);

    this.apiService.getMissions().subscribe(missions => {
      this.missions = missions;
      missions.forEach(mission => {
        if (mission.missionId === missionId) {
          this.setMission(mission, aisleId);
        }
      });
    });
  }

  ngOnDestroy() {
    this.logoSubscription.unsubscribe();
  }

  changePanoMode() {
    this.panoMode = !this.panoMode;
  }

  resetPanoClicked() {
    this.resetPano = !this.resetPano;
  }

  changeMission(mission: Mission) {
    this.apiService.getAisles(mission.missionId).subscribe(aisles => {
      this.setMission(mission, aisles[0].aisleId);
    });
  }

  setMission(mission: Mission, aisleId: number) {
    this.selectedMission = mission;
    this.apiService.getAisles(mission.missionId).subscribe(aisles => {
      this.aisles = aisles;
      aisles.forEach(aisle => {
        if (aisle.aisleId === aisleId) {
          this.setAisle(aisle);
        }
      });
    });
  }

  setAisle(aisle: Aisle) {
    this.selectedAisle = aisle;
    this.apiService.getAisle(aisle.aisleId).subscribe(fullAisle => {
      this.outs = fullAisle.outs;
      this.labels = fullAisle.labels;
      this.panoramaUrl = fullAisle.panoramaUrl;
      this.currentDisplay = 'outs';
      this.currentId = null;
    });
    this.location.replaceState('/mission/' + this.selectedMission.missionId + '/aisle/' + this.selectedAisle.aisleId);
  }

  setId(id: number) {
    this.currentId = id;
  }

  hideDropdowns() {
    this.panoTouched = true;
  }

  setDisplay(display) {
    this.currentDisplay = display;
  }
}
