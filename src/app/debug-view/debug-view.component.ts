import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Params } from '@angular/router';
import Detection from '../models/detection.model';
import { EnvironmentService } from '../services/environment.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-debug-view',
  templateUrl: './debug-view.component.html',
  styleUrls: ['./debug-view.component.scss'],
})

export class DebugViewComponent implements OnInit {

  panoramaUrl: String;
  detections = Array<Detection>();
  displayedDetections = new Map<string, Detection>();

  // keep track of which filters are enabled
  detectionTypes = new Map<string, boolean>();
  tags = new Map<string, boolean>();
  classifications = new Map<string, boolean>();

  // map detection types, classifications, and tags to colors
  detectionTypeColors = new Map<string, string>();
  tagColors = new Map<string, string>();
  classificationColors = new Map<string, string>();

  // determine which color are shown if two detectionTypes, tags, classifications are applied to the same detection
  // highest index in the array has priority
  detectionTypeColorOrder = new Array<string>();
  classificationColorOrder = new Array<string>();
  tagColorOrder = new Array<string>();


  constructor(private readonly apiService: ApiService,
    private readonly activatedRoute: ActivatedRoute,
    private environment: EnvironmentService,
    private titleService: Title) {
  }

  ngOnInit() {
    let aisleId: string;
    let missionId: string;
    let storeId: string;

    void this.activatedRoute.params.forEach((params: Params) => {
      if (params.aisleId !== undefined) {
        aisleId = params.aisleId;
      }
      if (params.missionId !== undefined) {
        missionId = params.missionId;
      }
      if (params.storeId !== undefined) {
        storeId = params.storeId;
      }
    });

    this.apiService.getAisle(storeId, missionId, aisleId).subscribe(aisle => {
      this.titleService.setTitle(aisle.aisleName + ' - Debug');
      this.panoramaUrl = aisle.panoramaUrl;

      this.apiService.getDetections(aisle.storeId, aisle.missionId, aisle.aisleId).subscribe(detections => {
        this.detections = detections;

        // set the filters to all of the unique values in the detection types and turn them all on by default
        detections.forEach(detection => {
          this.detectionTypes.set(detection.detectionType, true);
        });
        detections.forEach(detection => {
          detection.tags.forEach(tag => {
            this.tags.set(tag, true);
          });
        });
        detections.forEach(detection => {
          detection.classifications.forEach(classification => {
            this.classifications.set(classification, true);
          });
        });

        this.setColorsFromConfig(this.detectionTypeColors, this.detectionTypeColorOrder, this.environment.config.detectionTypeColors);
        this.setColorsFromConfig(this.classificationColors, this.classificationColorOrder, this.environment.config.classificationColors);
        this.setColorsFromConfig(this.tagColors, this.tagColorOrder, this.environment.config.tagColors);
        this.updateDisplayedDetections();
      });
    });
  }

  // set colors from environment cofig
  setColorsFromConfig(colorsMap: Map<string, string>, colorsOrder: Array<string>, configString: string[]) {
    if (configString) {
      configString.forEach(config => {
        const configValues = config.split(':');
        colorsMap.set(configValues[0], configValues[1]);
        colorsOrder.unshift(configValues[0]);
      });
    }
  }

  toggleFilters(toggleInfo: any) {
    switch (toggleInfo.filterName) {
      case 'detectionTypes':
        this.detectionTypes.set(toggleInfo.filterValue, !this.detectionTypes.get(toggleInfo.filterValue));
        break;
      case 'tags':
        this.tags.set(toggleInfo.filterValue, !this.tags.get(toggleInfo.filterValue));
        break;
      case 'classifications':
        this.classifications.set(toggleInfo.filterValue, !this.classifications.get(toggleInfo.filterValue));
        break;
    }
    this.updateDisplayedDetections();
  }

  // Create a list of detections that should be displayed based on which filters are checked and set the colors for each of those detections
  updateDisplayedDetections() {
    this.displayedDetections.clear();
    this.detections.forEach( detection => {
      // all labels are set to detection type color by default and gray if not detection type color
      if (this.detectionTypeColors.has(detection.detectionType)) {
        detection.color = this.detectionTypeColors.get(detection.detectionType);
      } else {
        detection.color = '#C0C0C0';
      }
      if (this.detectionTypes.get(detection.detectionType)) {
        this.displayedDetections.set(detection.detectionId, detection);
      }

      let currentColorOrder = -1; // colors are only set if no classification listed first in the config was already used
      detection.classifications.forEach( classification => {
        if (this.classifications.get(classification)) {
          if (this.classificationColors.has(classification) && this.classificationColorOrder.indexOf(classification) > currentColorOrder) {
            currentColorOrder = this.classificationColorOrder.indexOf(classification);
            detection.color = this.classificationColors.get(classification);  // overwrite with classification color
          }
          this.displayedDetections.set(detection.detectionId, detection);
        }
      });

      currentColorOrder = -1; // colors are only set if no tag listed first in the config was already used
      detection.tags.forEach( tag => {
        if (this.tags.get(tag)) {
          if (this.tagColors.has(tag) && this.tagColorOrder.indexOf(tag) > currentColorOrder) { // overwrite with tag color
            currentColorOrder = this.tagColorOrder.indexOf(tag);
            detection.color = this.tagColors.get(tag);
          }
          this.displayedDetections.set(detection.detectionId, detection);
        }
      });
    });
  }
}
