import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@fortawesome/fontawesome-svg-core';
import Mission from '../models/mission.model';
import Aisle from '../models/aisle.model';
import { LabelType } from '../shared/label-type';
import Label from '../models/label.model';
import { Title } from '@angular/platform-browser';
import {Location} from '@angular/common';

@Component({
  selector: 'app-aisle-comparison-view',
  templateUrl: './aisle-comparison-view.component.html',
  styleUrls: ['./aisle-comparison-view.component.scss']
})
export class AisleComparisonViewComponent implements OnInit {

  missions: Mission[];
  panoramaUrl: string;
  comparisonPanoramaUrl: string;
  selectedMission: Mission;
  selectedAisle: Aisle;
  comparableAisles: Aisle[];
  selectedComparisonAisle: Aisle;
  labelsChanged = false;
  labels = new Map<LabelType, Array<Label>>();
  comparisonLabels = new Map<LabelType, Array<Label>>();
  sectionBreaks: number[];
  comparisonSectionBreaks: number[];
  currentlyDisplayed: Array<LabelType> = new Array<LabelType>();
  panoPosition: any;
  panoChanged = false;

  constructor(private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private titleService: Title) { }

  ngOnInit() {
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
      this.apiService.getMission(store.storeId, missionId, store.zoneId).subscribe(mission => {
        const start: Date = new Date();
        start.setTime(mission.startDateTime.getTime());
        const end: Date = new Date(start);
        end.setDate(end.getDate() + 3);
        start.setDate(start.getDate() - 3);
        this.apiService.getMissions(store.storeId, start, end, store.zoneId).subscribe(missions => {
          this.missions = missions;
          this.setMission(mission, aisleId);
        });
      });
    });

    this.currentlyDisplayed.push(LabelType.outs);
    this.currentlyDisplayed.push(LabelType.shelfLabels);
    this.currentlyDisplayed.push(LabelType.sectionBreaks);
    this.currentlyDisplayed.push(LabelType.misreadBarcodes);
    this.currentlyDisplayed.push(LabelType.topStock);
    this.currentlyDisplayed.push(LabelType.sectionLabels);
  }

  setMission(mission: Mission, aisleId: string) {
    this.selectedMission = mission;
    mission.aisles.forEach(aisle => {
      if (aisle.aisleId.toString() === aisleId || aisle.aisleName === aisleId) {
        this.setAisle(aisle);
      }
    });
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
    });

    this.setComparisonAisle(aisle);

    this.comparableAisles = [];
    this.missions.forEach(mission => {
      mission.aisles.forEach(a => {
        if (a.aisleName === aisle.aisleName) {
          a.missionName = mission.missionName;
          a.missionId = mission.missionId;
          this.comparableAisles.push(a);
        }
      });
    });

    this.location.replaceState(
      'store/' + this.selectedMission.storeId + '/mission/' + this.selectedMission.missionId +
      '/aisle/' + this.selectedAisle.aisleId + '/compare');
  }

  setComparisonAisle(aisle: Aisle) {
    const missionId = aisle.missionId ? aisle.missionId : this.selectedMission.missionId;
    this.apiService.getAisle(this.selectedMission.storeId, missionId, aisle.aisleId).subscribe(fullAisle => {
      this.selectedComparisonAisle = fullAisle;
      const misreadBarcodes: Array<Label> = this.getMissingBarcodes(fullAisle.labels);
      misreadBarcodes.concat(this.getMissingBarcodes(fullAisle.outs));
      this.comparisonLabels.set(LabelType.misreadBarcodes, misreadBarcodes);
      this.comparisonLabels.set(LabelType.outs, fullAisle.outs);
      this.comparisonLabels.set(LabelType.shelfLabels, fullAisle.labels);
      this.comparisonLabels.set(LabelType.sectionLabels, fullAisle.sectionLabels);
      this.comparisonLabels.set(LabelType.topStock, fullAisle.topStock);
      this.comparisonLabels.set(LabelType.previouslySeenBarcodes, fullAisle.missingPreviouslySeenBarcodes);
      this.comparisonSectionBreaks = fullAisle.sectionBreaks;
      this.labelsChanged = !this.labelsChanged;
      this.comparisonPanoramaUrl = fullAisle.panoramaUrl;
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

  panoramaTransformed(transform) {
    this.panoPosition = transform;
    this.panoChanged = !this.panoChanged;
  }
}
