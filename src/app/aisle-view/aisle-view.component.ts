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
  misreadBarcodes: Label[];
  sectionLabels: Label[];
  topStock: Label[];
  sectionBreaks: number[];
  missions: Mission[];
  selectedMission: Mission;
  selectedAisle: Aisle;
  currentId: number;
  panoramaUrl: string;
  panoMode: boolean;
  panoTouched: boolean;
  resetPano: boolean;
  resetPanoAfterExport: boolean;
  debugMode: boolean;
  missingBarcodesMode: boolean;
  private logoSubscription: Subscription;
  private backButtonSubscription: Subscription;
  currentlyDisplayed: Array<string> = new Array<string>();

  constructor(@Inject('ApiService') private apiService: ApiService,
              private keyboard: KeyboardShortcutsService,
              private logoService: LogoService,
              private backService: BackService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router
              ) {
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
    this.currentlyDisplayed.push('outs');
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
    this.apiService.getStore(storeId, new Date(), new Date()).subscribe(store => {
      this.apiService.getMission(storeId, missionId, store.timezone).subscribe(mission => {
        const start: Date = new Date();
        start.setTime(mission.startDateTime.getTime());
        const end: Date = new Date(start);
        end.setDate(end.getDate() + 3);
        start.setDate(start.getDate() - 3);
        this.apiService.getMissions(storeId, start, end, store.timezone).subscribe(missions => {
          this.setMission(mission, aisleId);
          this.missions = missions;
        });
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

  toggleMode(mode: string) {
    switch (mode) {
      case 'debug':
        this.debugMode = !this.debugMode;
        break;
      case 'missingBarcodes':
        this.missingBarcodesMode = !this.missingBarcodesMode;
        break;
    }
  }

  // If the element is in the list remove it, if not add it.  Move shelf labels to the front so they arent written over outs in the UI
  toggleDisplayed(d: string) {
    if (this.currentlyDisplayed.indexOf(d) !== -1) {
      this.currentlyDisplayed.splice(this.currentlyDisplayed.indexOf(d), 1);
    } else {
      if (d === 'shelfLabels') {
        this.currentlyDisplayed.unshift(d);
      } else {
        this.currentlyDisplayed.push(d);
      }
    }
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
      this.misreadBarcodes = [];
      this.labels.forEach(label => {
        if (/^0*$/.test(label.barcode)) {
          this.misreadBarcodes.push(label);
        }
      });
      this.outs.forEach(out => {
        if (/^0*$/.test(out.barcode)) {
          this.misreadBarcodes.push(out);
        }
      });
      this.sectionLabels = fullAisle.sectionLabels;
      this.topStock = fullAisle.topStock;
      this.sectionBreaks = fullAisle.sectionBreaks;
      this.panoramaUrl = fullAisle.panoramaUrl;
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

  changeMissedCategory(info) {
    this.apiService.updateMissedLabelAnnotation(
      this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.top, info.left, info.category
    );
  }

  addMissedCategory(info) {
    this.apiService.createMissedLabelAnnotation(
      this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.top, info.left, info.category
    );
  }

  deleteMissedCategory(info) {
    this.apiService.deleteMissedLabelAnnotation(
      this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.top, info.left
    );
  }

  changeMisreadCategory(info) {
    // TODO fix this so it updates the child components in a better way (service)
    const i = this.misreadBarcodes.findIndex((obj => obj.labelId === info.labelId));
    this.misreadBarcodes[i].misreadType = info.category;
    const labels = this.misreadBarcodes.slice(1);
    const temp = this.misreadBarcodes[0];
    this.misreadBarcodes = labels;
    this.misreadBarcodes.unshift(temp);

    this.apiService.updateMisreadLabelAnnotation(
      this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
    );
  }

  addMisreadCategory(info) {
    // TODO fix this so it updates the child components in a better way (service)
    const i = this.misreadBarcodes.findIndex((obj => obj.labelId === info.labelId));
    this.misreadBarcodes[i].misreadType = info.category;
    const labels = this.misreadBarcodes.slice(1);
    const temp = this.misreadBarcodes[0];
    this.misreadBarcodes = labels;
    this.misreadBarcodes.unshift(temp);

    this.apiService.createMisreadLabelAnnotation(
      this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
    );
  }

  deleteMisreadCategory(info) {
    // TODO fix this so it updates the child components in a better way (service)
    const i = this.misreadBarcodes.findIndex((obj => obj.labelId === info.labelId));
    this.misreadBarcodes[i].misreadType = info.category;
    const labels = this.misreadBarcodes.slice(1);
    const temp = this.misreadBarcodes[0];
    this.misreadBarcodes = labels;
    this.misreadBarcodes.unshift(temp);

    this.apiService.deleteMisreadLabelAnnotation(
      this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId
    );
  }
}
