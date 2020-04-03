import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-debug-view',
  templateUrl: './debug-view.component.html',
  styleUrls: ['./debug-view.component.scss'],
})

export class DebugViewComponent implements OnInit {

  panoramaUrl: String;
  detectionTypes = new Map<string, boolean>();
  tags = new Map<string, boolean>();
  classifications = new Map<string, boolean>();

  constructor(private readonly apiService: ApiService,
    private readonly activatedRoute: ActivatedRoute) {
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

    // this.apiService.getDebugData(storeId, missionId, aisleId).subscribe(debug => {
    // });
    this.detectionTypes.set('dt 1', false);
    this.detectionTypes.set('dt 2', false);
    this.tags.set('t 1', false);
    this.tags.set('t 2', false);
    this.classifications.set('c 1', false);
    this.classifications.set('c 2', false);
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
  }
}
