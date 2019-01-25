import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Store from '../store.model';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss']
})

export class StoreViewComponent implements OnInit {
  missionSummaries: MissionSummary[];
  store: Store;
  storeId: string;
  selectedIndex: string;
  selectedDate: Date;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['storeId'] !== undefined) {
        this.storeId = params['storeId'];
      }
    });
    this.apiService.getStore(this.storeId).subscribe(store => this.store = store);
  }

  ngOnInit() {
  }

  setIndex(selectedValues) {
    this.selectedIndex = selectedValues.index;
    this.selectedDate = selectedValues.date;
    this.apiService.getMissionSummaries(this.selectedDate, this.storeId).subscribe(
      missionSummaries => this.missionSummaries = missionSummaries
    );
  }

}
