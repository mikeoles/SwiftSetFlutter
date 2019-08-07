import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ApiService } from './../api.service';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import Mission from './../mission.model';
import Aisle from './../aisle.model';
import Label from './../label.model';
import { ViewEncapsulation } from '@angular/core';
import { LogoService } from '../logo.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Location} from '@angular/common';
import { BackService } from '../back.service';

@Component({
  selector: 'app-aisle-view',
  templateUrl: './aisle-view.component.html',
  styleUrls: ['./aisle-view.component.scss'],
  providers: [ KeyboardShortcutsService,
  ],
  encapsulation: ViewEncapsulation.None
})

export class AisleViewComponent implements OnInit, OnDestroy {
  title = 'aisle';
  outs: Label[];
  labels: Label[];
  missions: Mission[];
  selectedMission: Mission;
  selectedAisle: Aisle;
  currentId: number;
  currentDisplay: string;
  panoramaUrl: string;
  panoMode: boolean;
  panoTouched: boolean;
  resetPano: boolean;
  resetPanoAfterExport: boolean;
  private logoSubscription: Subscription;
  private backButtonSubscription: Subscription;

  constructor(@Inject('ApiService') private apiService: ApiService,
              private keyboard: KeyboardShortcutsService,
              private logoService: LogoService,
              private backService: BackService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router
              ) {
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
    this.backButtonSubscription = this.backService.backClickEvent().subscribe(() => this.goBack());

    let missionId: string, aisleId: string, storeId: string;
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        missionId = params['missionId'];
      }
      if (params['aisleId'] !== undefined) {
        aisleId = params['aisleId'];
      }
      if (params['storeId'] !== undefined) {
        storeId = params['storeId'];
      }
    });
    this.apiService.getMission(storeId, missionId).subscribe(mission => {
      const start: Date = new Date();
      start.setTime(mission.startDateTime.getTime());
      start.setHours(0, 0, 0, 0);
      this.apiService.getMissions(storeId, start, start).subscribe(missions => {
        this.setMission(mission, aisleId);
        this.missions = missions.filter(m => m.startDateTime.toDateString() === mission.startDateTime.toDateString());
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/store/' + this.selectedMission.storeId + '/mission/' + this.selectedMission.missionId]);
  }

  ngOnDestroy() {
    this.logoSubscription.unsubscribe();
    this.backButtonSubscription.unsubscribe();
  }

  changePanoMode() {
    this.panoMode = !this.panoMode;
  }

  resetPanoClicked() {
    this.resetPano = !this.resetPano;
  }

  resetPanoAfterExportClicked() {
    this.resetPanoAfterExport = !this.resetPanoAfterExport;
  }

  changeMission(mission: Mission) {
    this.setMission(mission, mission.aisles[0].aisleId);
  }

  setMission(mission: Mission, aisleId: string) {
    this.selectedMission = mission;
    mission.aisles.forEach(aisle => {
      if (aisle.aisleId.toString() === aisleId) {
        this.setAisle(aisle);
      }
    });
  }

  setAisle(aisle: Aisle) {
    this.selectedAisle = aisle;
    this.apiService.getAisle(this.selectedMission.storeId, this.selectedMission.missionId, aisle.aisleId).subscribe(fullAisle => {
      this.outs = fullAisle.outs;
      this.labels = fullAisle.labels;
      this.panoramaUrl = fullAisle.panoramaUrl;
      this.currentDisplay = 'outs';
      this.currentId = null;
    });
    this.location.replaceState(
      'store/' + this.selectedMission.storeId + '/mission/' + this.selectedMission.missionId + '/aisle/' + this.selectedAisle.aisleId);
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
