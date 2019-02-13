import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Store from '../store.model';
import DaySummary from '../daySummary.model';

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
    this.apiService.getStore(this.storeId).subscribe(store => {
      this.store = store;
      const allSummaryOuts: Array<DaySummary> = [];
      const allSummaryLabels: Array<DaySummary> = [];
      const d = new Date();

      for (let i = 0; i < 14; i++) {
        d.setDate(d.getDate() - 1);
        const cur: Date = new Date(d.toDateString());

        let dailyLabelAverage = 0;
        for (let j = 0; j < this.store.summaryLabels.length; j++) {
          if (this.store.summaryLabels[j].date.toString() === d.toISOString().substring(0, 10)) {
              dailyLabelAverage = this.store.summaryLabels[j].dailyAverage;
            }
          }

        let dailyOutAverage = 0;
        for (let j = 0; j < this.store.summaryOuts.length; j++) {
          if (this.store.summaryOuts[j].date.toString() === d.toISOString().substring(0, 10)) {
            dailyOutAverage = this.store.summaryOuts[j].dailyAverage;
          }
        }

        allSummaryLabels.push({
          date: cur,
          dailyAverage: dailyLabelAverage
        });

        allSummaryOuts.push({
          date: cur,
          dailyAverage: dailyOutAverage
        });

      }
      this.store.summaryOuts = allSummaryOuts;
      this.store.summaryLabels = allSummaryLabels;
    });
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
