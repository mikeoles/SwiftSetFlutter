import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import Mission from '../models/mission.model';
import Aisle from '../models/aisle.model';
import Label from '../models/label.model';
import { ViewEncapsulation } from '@angular/core';
import { LogoService } from '../services/logo.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Location} from '@angular/common';
import { BackService } from '../services/back.service';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { LabelType } from 'src/app/shared/label-type';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-aisle-view',
  templateUrl: './aisle-view.component.html',
  styleUrls: ['./aisle-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AisleViewComponent implements OnInit, OnDestroy {
  labels = new Map<LabelType, Array<Label>>();
  sectionBreaks: number[];
  missions: Mission[];
  selectedMission: Mission;
  selectedAisle: Aisle;
  currentId: string;
  panoramaUrl: string;
  panoMode: boolean;
  resetPano: boolean;
  showCoverageIssueDetails: boolean;

  private logoSubscription: Subscription;
  private backButtonSubscription: Subscription;
  currentlyDisplayed: Array<string> = new Array<string>();
  shortcuts: ShortcutInput[] = [];
  labelsChanged = false;
  exportPano = false;
  currentlyDisplayedToggled: boolean;

  constructor(private apiService: ApiService,
              private logoService: LogoService,
              private backService: BackService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router,
              private titleService: Title,
              ) {
    this.panoMode = false;

    this.shortcuts.push(
      {
        key: 'ctrl + o',
        command: () => this.changePanoMode(),
        preventDefault: true
      }
    );
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
      this.apiService.getMission(storeId, missionId, store.zoneId).subscribe(mission => {
        const start: Date = new Date();
        start.setTime(mission.startDateTime.getTime());
        const end: Date = new Date(start);
        end.setDate(end.getDate() + 3);
        start.setDate(start.getDate() - 3);
        this.apiService.getMissions(storeId, start, end, store.zoneId).subscribe(missions => {
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

  exportPanoClicked() {
    this.exportPano = !this.exportPano;
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
    this.currentlyDisplayedToggled = !this.currentlyDisplayedToggled;
    this.labelsChanged = !this.labelsChanged;
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

  // Barcodes with all zeroes are considered missing barcodes
  getMissingBarcodes(labels: Array<Label>): Array<Label> {
    const misreadBarcodes: Array<Label> = [];
    labels.forEach(label => {
      if (/^0*$/.test(label.barcode)) {
        misreadBarcodes.push(label);
      }
    });
    return misreadBarcodes;
  }

  setAisle(aisle: Aisle) {
    this.selectedAisle = aisle;
    this.apiService.getAisle(this.selectedMission.storeId, this.selectedMission.missionId, aisle.aisleId).subscribe(fullAisle => {
      this.titleService.setTitle(this.selectedMission.storeName + ' - ' + fullAisle.aisleName);
      const misreadBarcodes: Array<Label> = this.getMissingBarcodes(fullAisle.labels);
      misreadBarcodes.concat(this.getMissingBarcodes(fullAisle.outs));

      this.labels.set(LabelType.misreadBarcodes, misreadBarcodes);
      this.labels.set(LabelType.outs, fullAisle.outs);
      this.labels.set(LabelType.shelfLabels, fullAisle.labels);
      this.labels.set(LabelType.sectionLabels, fullAisle.sectionLabels);
      this.labels.set(LabelType.topStock, fullAisle.topStock);
      this.labels.set(LabelType.previouslySeenBarcodes, fullAisle.missingPreviouslySeenBarcodes);
      this.labelsChanged = !this.labelsChanged;
      this.sectionBreaks = fullAisle.sectionBreaks;
      this.panoramaUrl = fullAisle.panoramaUrl;
      this.currentId = null;
    });
    this.location.replaceState(
      'store/' + this.selectedMission.storeId + '/mission/' + this.selectedMission.missionId + '/aisle/' + this.selectedAisle.aisleId);
  }

  setId(id: string) {
    this.currentId = id;
  }

  toggleCoverageIssueDetails() {
    this.showCoverageIssueDetails = !this.showCoverageIssueDetails;
  }
}
