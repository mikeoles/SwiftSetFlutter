import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Store from '../store.model';
import DaySummary from '../daySummary.model';
import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss'],
})

export class StoreViewComponent implements OnInit {
  missionSummaries: MissionSummary[];
  store: Store;
  storeId: string;
  selectedIndex: string;
  selectedDate: Date;
  graphStartDate: Date;
  options: DatepickerOptions = {
    displayFormat: 'MMMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    addStyle: {'border': '2px #2baae1 solid', 'border-radius': '30px', 'color': '#2baae1', 'font-size' : '18px', 'height' : '45px',
    'font-weight': 'bold', 'width': 'auto', 'text-align': 'center', 'cursor': 'pointer'
  }
  };

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.graphStartDate = new Date();
    this.graphStartDate.setDate(this.graphStartDate.getDate() - 13); // Two weeks ago by default

    this.activatedRoute.params.forEach((params: Params) => {
      if (params['storeId'] !== undefined) {
        this.storeId = params['storeId'];
      }
    });
    this.apiService.getStore(this.storeId, this.graphStartDate).subscribe(store => {
      this.setAllSummaryValues(store);
    });
  }

  ngOnInit() {
  }

  changeGraphDates(event) {
    this.graphStartDate = new Date(event);
    this.apiService.getStore(this.storeId, this.graphStartDate).subscribe(store => {
      this.setAllSummaryValues(store);
    });
  }

  setIndex(selectedValues) {
    this.selectedIndex = selectedValues.index;
    this.selectedDate = selectedValues.date;
    this.apiService.getMissionSummaries(this.selectedDate, this.storeId).subscribe(
      missionSummaries => this.missionSummaries = missionSummaries
    );
  }

  // Add summary values for days with no labels or outs
  setAllSummaryValues(store) {
    this.store = store;
    const allSummaryOuts: Array<DaySummary> = [];
    const allSummaryLabels: Array<DaySummary> = [];
    const d = this.graphStartDate;

    for (let i = 0; i < 14; i++) {
      const cur: Date = new Date(d.toDateString());
      d.setDate(d.getDate() + 1);

      let dailyLabelAverage = 0;
      for (let j = 0; j < this.store.summaryLabels.length; j++) {
        if (this.store.summaryLabels[j].date.toString() === cur.toISOString().substring(0, 10)) {
            dailyLabelAverage = this.store.summaryLabels[j].dailyAverage;
          }
        }

      let dailyOutAverage = 0;
      for (let j = 0; j < this.store.summaryOuts.length; j++) {
        if (this.store.summaryOuts[j].date.toString() === cur.toISOString().substring(0, 10)) {
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
  }

}
