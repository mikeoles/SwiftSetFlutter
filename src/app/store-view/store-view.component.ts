import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Store from '../store.model';
import DaySummary from '../daySummary.model';
import { DatepickerOptions } from 'ng2-datepicker';
import { ApiService } from '../api.service';
import { EnvironmentService } from '../environment.service';
import { ODataApiService } from '../oDataApi.service';
import { StaticApiService } from '../staticApi.service';
import { BackService } from '../back.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss'],
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
    addStyle: {'border': '3px #2baae1 solid', 'border-radius': '30px', 'color': '#2baae1', 'font-size' : '18px', 'height' : '38px',
      'font-weight': 'bold', 'width': 'auto', 'text-align': 'center', 'cursor': 'pointer'
    }
  };

  private backButtonSubscription: Subscription;

  constructor(@Inject('ApiService') private apiService: ApiService, private activatedRoute: ActivatedRoute,
  private environmentService: EnvironmentService, private backService: BackService, private router: Router) {
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
    this.backButtonSubscription = this.backService.backClickEvent().subscribe(() => this.goBack());
  }

  goBack(): void {
    this.router.navigate(['/']);
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
        if (this.environmentService.config.apiType === 'odata' &&
          this.store.summaryLabels[j].date.toString() === cur.toISOString().substring(0, 10) ||
          this.environmentService.config.apiType === 'static' &&
          this.store.summaryLabels[j].date.toDateString() === cur.toDateString()) {
            dailyLabelAverage = this.store.summaryLabels[j].dailyAverage;
          }
        }

      let dailyOutAverage = 0;
      for (let j = 0; j < this.store.summaryOuts.length; j++) {
        if (this.environmentService.config.apiType === 'odata' &&
          this.store.summaryOuts[j].date.toString() === cur.toISOString().substring(0, 10) ||
          this.environmentService.config.apiType === 'static' &&
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

  exportPerformanceData() {
    const endDate: Date = new Date(this.graphStartDate.toString());
    endDate.setDate(endDate.getDate() + 13);
  this.apiService.getRangeMissionSummaries(this.graphStartDate, endDate, this.storeId,
      Intl.DateTimeFormat().resolvedOptions().timeZone).subscribe(
      missionSummaries => {
        const body = [];
        missionSummaries.forEach( missionSummary => {
          let row = [];
          row = row.concat(missionSummary.missionDateTime.toLocaleString().replace(',', ''));
          row = row.concat(this.store.storeName);
          row = row.concat(missionSummary.aislesScanned);
          row = row.concat(missionSummary.labels);
          row = row.concat(missionSummary.unreadLabels);
          row = row.concat(missionSummary.percentageUnread);
          row = row.concat(missionSummary.percentageRead);
          row = row.concat(missionSummary.readLabelsMatchingProduct);
          row = row.concat(missionSummary.readLabelsMissingProduct);
          row = row.concat(missionSummary.outs);
          body.push(row);
        });
        this.saveCSV(body);
      }
    );
  }

  saveCSV(body: any[]) {
    const columnNames = ['Mision Date', 'Customer - Store', 'Total Aisles Scanned', 'Total # Of Labels', 'Total # Unread Labels',
    'Percemtage Unread Labels', 'Percentage Read Labels', '# Read Labels With Matching Product', '# Read Labels Missing Product',
    'Total # OOS'];
    let csvString = columnNames.join(',') + '\n';
    for (let j = 0; j < body.length; j++) {
      csvString += body[j].join(',') + '\n';
    }
    const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8,%EF%BB%BF' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', csvUrl);
    link.setAttribute('download', 'PerformanceData-' + this.graphStartDate.toDateString() + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
