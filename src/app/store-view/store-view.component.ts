import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Store from '../store.model';
import DaySummary from '../daySummary.model';
import { DatepickerOptions } from 'ng2-datepicker';
import { environment } from 'src/environments/environment';
import { IApiService } from '../api.service';
import { EnvironmentService } from '../environment.service';
import { ODataApiService } from '../oDataApi.service';
import { StaticApiService } from '../staticApi.service';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss'],
  providers: [
    {
      provide: 'IApiService',
      useClass: environment.apiService
    }],
})

export class StoreViewComponent implements OnInit {
  missionSummaries: MissionSummary[];
  store: Store;
  storeId: number;
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

  constructor(@Inject('IApiService') private apiService: IApiService, private activatedRoute: ActivatedRoute,
  private environmentService: EnvironmentService) {
    this.graphStartDate = new Date();
    this.graphStartDate.setDate(this.graphStartDate.getDate() - 13); // Two weeks ago by default
    this.graphStartDate.setHours(0, 0, 0, 0);
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['storeId'] !== undefined) {
        this.storeId = params['storeId'];
      }
    });
    this.apiService.getStore(this.storeId, this.graphStartDate, Intl.DateTimeFormat().resolvedOptions().timeZone).subscribe(store => {
      this.setAllSummaryValues(store);
    });
  }

  ngOnInit() {
  }

  changeGraphDates(event) {
    this.graphStartDate = new Date(event);
    this.graphStartDate.setHours(0, 0, 0, 0);
    this.apiService.getStore(this.storeId, this.graphStartDate, Intl.DateTimeFormat().resolvedOptions().timeZone).subscribe(store => {
      this.setAllSummaryValues(store);
    });
  }

  setIndex(selectedValues) {
    this.selectedIndex = selectedValues.index;
    this.selectedDate = selectedValues.date;
    this.apiService.getMissionSummaries(this.selectedDate, this.storeId, Intl.DateTimeFormat().resolvedOptions().timeZone).subscribe(
      missionSummaries => this.missionSummaries = missionSummaries
    );
  }

  // Add summary values for days with no labels or outs
  setAllSummaryValues(store) {
    this.store = store;
    const allSummaryOuts: Array<DaySummary> = [];
    const allSummaryLabels: Array<DaySummary> = [];
    const d = new Date(this.graphStartDate.toDateString());

    for (let i = 0; i < 14; i++) {
      const cur: Date = new Date(d.toDateString());
      d.setDate(d.getDate() + 1);

      let dailyLabelAverage = 0;
      for (let j = 0; j < this.store.summaryLabels.length; j++) {
        if (this.environmentService.config.apiService === ODataApiService &&
          this.store.summaryLabels[j].date.toString() === cur.toISOString().substring(0, 10) ||
          this.environmentService.config.apiService === StaticApiService &&
          this.store.summaryLabels[j].date.toDateString() === cur.toDateString()) {
            dailyLabelAverage = this.store.summaryLabels[j].dailyAverage;
          }
        }

      let dailyOutAverage = 0;
      for (let j = 0; j < this.store.summaryOuts.length; j++) {
        if (this.environmentService.config.apiService === ODataApiService &&
          this.store.summaryOuts[j].date.toString() === cur.toISOString().substring(0, 10) ||
          this.environmentService.config.apiService === StaticApiService &&
          this.store.summaryOuts[j].date.toDateString() === cur.toDateString()) {
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
