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
  }
}
