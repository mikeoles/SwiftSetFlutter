import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../api.service';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import Mission from './../mission.model';
import Aisle from './../aisle.model';
import Label from './../label.model';
import { ViewEncapsulation } from '@angular/core';
import { LogoService } from '../logo.service';
import { Subscription } from 'rxjs';

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
              private logoService: LogoService) {
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

    this.apiService.getMissions().subscribe(missions => {
      this.missions = missions;
      this.setMission(this.missions[0]);
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
