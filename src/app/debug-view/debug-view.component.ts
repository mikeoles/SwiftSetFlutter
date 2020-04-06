import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Params } from '@angular/router';
import Detection from '../detection.model';
import { EnvironmentService } from '../environment.service';

@Component({
  selector: 'app-debug-view',
  templateUrl: './debug-view.component.html',
  styleUrls: ['./debug-view.component.scss'],
})

export class DebugViewComponent implements OnInit {

  panoramaUrl: String;
  detections = Array<Detection>();
  displayedDetections = new Map<number, Detection>();

  // keep track of which filters are enabled
  detectionTypes = new Map<string, boolean>();
  tags = new Map<string, boolean>();
  classifications = new Map<string, boolean>();

  // map detection types, classifications, and tags to colors
  detectionTypeColors = new Map<string, string>();
  tagColors = new Map<string, string>();
  classificationColors = new Map<string, string>();

  constructor(private readonly apiService: ApiService,
    private readonly activatedRoute: ActivatedRoute,
    private environment: EnvironmentService) {
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
      this.panoramaUrl = aisle.panoramaUrl;
    });

    this.apiService.getDetections(storeId, missionId, aisleId).subscribe(detections => {
      this.detections = detections;

      // set the filters to all of the unique values in the detection types and turn them all off by default
      detections.forEach(detection => {
        this.detectionTypes.set(detection.detectionType, false);
      });
      detections.forEach(detection => {
        detection.tags.forEach(tag => {
          this.tags.set(tag, false);
        });
      });
      detections.forEach(detection => {
        detection.classifications.forEach(classification => {
          this.classifications.set(classification, false);
        });
      });

      this.setColorsFromConfig(this.detectionTypeColors, this.environment.config.detectionTypeColors);
      this.setColorsFromConfig(this.classificationColors, this.environment.config.classificationColors);
      this.setColorsFromConfig(this.tagColors, this.environment.config.tagColors);
    });
  }

  // set colors from environment cofig
  setColorsFromConfig(colorsMap: Map<string, string>, configString: string[]) {
    configString.forEach(config => {
      const configValues = config.split(':');
      colorsMap.set(configValues[0], configValues[1]);
    });
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
      detection.color = this.detectionTypeColors.get(detection.detectionType); // set to detectionType color by default
      if (this.detectionTypes.get(detection.detectionType)) {
        this.displayedDetections.set(detection.detectionId, detection);
      }
      detection.classifications.forEach( classification => {
        if (this.classifications.get(classification)) {
          if (this.classificationColors.has(classification)) { // overwrite with classificaiton color
            detection.color = this.classificationColors.get(classification);
          }
          this.displayedDetections.set(detection.detectionId, detection);
        }
      });
      detection.tags.forEach( tag => {
        if (this.tags.get(tag)) {
          if (this.tagColors.has(tag)) { // overwrite with tag color
            detection.color = this.tagColors.get(tag);
          }
          this.displayedDetections.set(detection.detectionId, detection);
        }
      });
    });
  }
}
