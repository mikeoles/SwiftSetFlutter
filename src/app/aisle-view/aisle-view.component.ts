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
import ExclusionZone from '../exclusionZone.model';

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
  exclusionZones: ExclusionZone[];
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
  resetPanoAfterExport: boolean;
  showExclusionZones = false;
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

    let missionId: number, aisleId: number, storeId: string;
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        missionId = Number(params['missionId']);
      }
      if (params['aisleId'] !== undefined) {
        aisleId = Number(params['aisleId']);
      }
      if (params['storeId'] !== undefined) {
        storeId = params['storeId'];
      }
    });

    this.apiService.getMissions(storeId).subscribe(missions => {
      const mission = missions.find(m => m.missionId === missionId);
      let date = new Date();

      if (mission) {
        this.setMission(mission, aisleId);
        date = mission.missionDateTime;
      }

      this.missions = missions.filter(m => m.missionDateTime.toDateString() === date.toDateString());
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
    this.apiService.getAisles(mission.storeId, mission.missionId).subscribe(aisles => {
      this.setMission(mission, aisles[0].aisleId);
    });
  }

  setMission(mission: Mission, aisleId: number) {
    this.selectedMission = mission;
    this.apiService.getAisles(mission.storeId, mission.missionId).subscribe(aisles => {
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
    this.apiService.getAisle(this.selectedMission.storeId, this.selectedMission.missionId, aisle.aisleId).subscribe(fullAisle => {
      this.outs = fullAisle.outs;
      this.labels = fullAisle.labels;
      this.exclusionZones = fullAisle.exclusionZones;
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

  toggleExclusionZone() {
    this.showExclusionZones = !this.showExclusionZones;
  }
}
