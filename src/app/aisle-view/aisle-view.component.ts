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
  private logoSubscription: Subscription;
  private backButtonSubscription: Subscription;
  currentlyDisplayed: Array<string> = new Array<string>();
  qaModesTurnedOn: Array<string> = new Array<string>();

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
    if (this.qaModesTurnedOn.indexOf(mode) !== -1) {
      this.qaModesTurnedOn.splice(this.qaModesTurnedOn.indexOf(mode), 1);
    } else {
      this.qaModesTurnedOn.push(mode);
    }
    this.qaModesTurnedOn = Object.assign([], this.qaModesTurnedOn);
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
    this.currentlyDisplayed = Object.assign([], this.currentlyDisplayed);
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

  updateMissedCategory(info) {
    if (info.action === 'update') {
      this.apiService.updateMissedLabelAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId,
        info.barcode.top, info.barcode.left, info.barcode.category
      );
    } else if (info.action === 'add') {
      this.apiService.createMissedLabelAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId,
        info.barcode.top, info.barcode.left, info.barcode.category
      );
    } else if (info.action === 'delete') {
      this.apiService.deleteMissedLabelAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.barcode.top, info.barcode.left
      );
    }
  }

  updateLabelCategory(info) {
    switch (info.annotationType) {
      case 'misread':
        return this.updateMisread(info);
      case 'falsePositive':
        return this.updateFalsePositive(info);
      case 'falseNegative':
        return this.updateFalseNegative(info);
    }
  }

  updateMisread(info: any): any {
    const i = this.misreadBarcodes.findIndex((obj => obj.labelId === info.labelId));
    if (info.action === 'delete') {
      delete this.misreadBarcodes[i].annotations['misread'];
    } else {
      this.misreadBarcodes[i].annotations['misread'] = info.category;
    }
    this.misreadBarcodes = Object.assign([], this.misreadBarcodes);

    if (info.action === 'update') {
      this.apiService.updateMisreadLabelAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
      );
    } else if (info.action === 'add') {
      this.apiService.createMisreadLabelAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
      );
    } else if (info.action === 'delete') {
      this.apiService.deleteMisreadLabelAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId
      );
    }
  }

  updateFalsePositive(info: any): any {
    const i = this.outs.findIndex((obj => obj.labelId === info.labelId));
    if (info.action === 'delete') {
      delete this.outs[i].annotations['falsePositive'];
    } else {
      this.outs[i].annotations['falsePositive'] = info.category;
    }
    this.outs = Object.assign([], this.outs);

    if (info.action === 'update') {
      this.apiService.updateFalsePositiveAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
      );
    } else if (info.action === 'add') {
      this.apiService.createFalsePositiveAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
      );
    } else if (info.action === 'delete') {
      this.apiService.deleteFalsePositiveAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId
      );
    }
  }

  updateFalseNegative(info: any): any {
    const i = this.labels.findIndex((obj => obj.labelId === info.labelId));
    if (info.action === 'delete') {
      delete this.labels[i].annotations['falseNegative'];
    } else {
      this.labels[i].annotations['falseNegative'] = info.category;
    }
    this.labels = Object.assign([], this.labels);

    if (info.action === 'update') {
      this.apiService.updateFalseNegativeAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
      );
    } else if (info.action === 'add') {
      this.apiService.createFalseNegativeAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId, info.category
      );
    } else if (info.action === 'delete') {
      this.apiService.deleteFalseNegativeAnnotation(
        this.selectedMission.storeId, this.selectedMission.missionId, this.selectedAisle.aisleId, info.labelId
      );
    }
  }
}
