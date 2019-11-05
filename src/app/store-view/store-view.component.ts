import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import Store from '../store.model';
import DaySummary from '../daySummary.model';
import { DatepickerOptions } from 'ng2-datepicker';
import { ApiService } from '../api.service';
import { EnvironmentService } from '../environment.service';
import { BackService } from '../back.service';
import { Subscription } from 'rxjs';
import Mission from '../mission.model';
import Aisle from '../aisle.model';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss'],
})

export class StoreViewComponent implements OnInit {
  missions: Mission[];
  store: Store;
  storeId: string;
  selectedIndex: string;
  selectedDate: Date;
  graphStartDate: Date;
  graphEndDate: Date;
  requestStartDate: Date;
  requestEndDate: Date;
  missionHistoryLength: Date;
  options: DatepickerOptions = {
    displayFormat: 'MMMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    addStyle: {'border': '3px #2baae1 solid', 'border-radius': '30px', 'color': '#2baae1', 'font-size' : '18px', 'height' : '38px',
      'font-weight': 'bold', 'width': 'auto', 'text-align': 'center', 'cursor': 'pointer'
    }
  };
  requestDateOptions: DatepickerOptions = {
    displayFormat: 'MMMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    addStyle: {'border': '3px #2baae1 solid', 'border-radius': '30px', 'color': '#2baae1', 'font-size' : '12px', 'height' : '18px',
      'font-weight': 'bold', 'width': 'auto', 'text-align': 'center', 'cursor': 'pointer'
    }
  };
  coverageDisplayType = 'description';
  error = false;
  currentlyRequesting = false;
  progress = 0;
  private backButtonSubscription: Subscription;

  constructor(private apiService: ApiService,
              private activatedRoute: ActivatedRoute,
              private environmentService: EnvironmentService,
              private backService: BackService,
              private router: Router,
              private modalService: ModalService) {
    this.coverageDisplayType = environmentService.config.coverageDisplayType;
    this.graphEndDate = new Date();
    this.graphStartDate = new Date();
    this.graphStartDate.setDate(this.graphEndDate.getDate() - environmentService.config.missionHistoryDays + 1);
    const start = new Date(this.graphStartDate);
    const end = new Date(this.graphEndDate);
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['storeId'] !== undefined) {
        this.storeId = params['storeId'];
      }
    });
    this.apiService.getStore(this.storeId, start, end).subscribe(store => {
      this.setAllSummaryValues(store);
    });
    this.requestStartDate = new Date();
    this.requestEndDate = new Date();
  }

  ngOnInit() {
    this.backButtonSubscription = this.backService.backClickEvent().subscribe(() => this.goBack());
    this.missionHistoryLength = this.environmentService.config.missionHistoryDays;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  changeGraphDates(event) {
    this.graphEndDate = new Date(event);
    this.graphStartDate = new Date(event);
    this.graphStartDate.setDate(this.graphStartDate.getDate() - this.environmentService.config.missionHistoryDays + 1);
    const start = new Date(this.graphStartDate);
    const end = new Date(this.graphEndDate);
    this.apiService.getStore(this.storeId, start, end).subscribe(store => {
      this.setAllSummaryValues(store);
    });
  }

  setIndex(selectedValues) {
    this.selectedIndex = selectedValues.index;
    this.selectedDate = selectedValues.date;
    const indexDate: Date = new Date(selectedValues.date);
    const end: Date = new Date(indexDate);
    end.setDate(end.getDate() + 1);
    this.apiService.getMissions(this.storeId, indexDate, end, this.store.timezone).subscribe(
      missions => this.missions = missions
    );
  }

  // Add summary values for days with no labels or outs
  setAllSummaryValues(store) {
    this.store = store;
    const allSummaryOuts: Array<DaySummary> = [];
    const allSummaryLabels: Array<DaySummary> = [];
    const d = new Date(new Date(this.graphStartDate.toDateString()).toLocaleString('en-US', {timeZone: store.timezone}));

    for (let i = 0; i < this.environmentService.config.missionHistoryDays; i++) {
      const cur: Date = new Date(d.toDateString());
      d.setDate(d.getDate() + 1);

      let dailyLabelAverage = 0;
      for (let j = 0; j < this.store.summaryLabels.length; j++) {
        if (this.store.summaryLabels[j].date.toDateString() === cur.toDateString()) {
            dailyLabelAverage = this.store.summaryLabels[j].dailyAverage;
          }
        }

      let dailyOutAverage = 0;
      for (let j = 0; j < this.store.summaryOuts.length; j++) {
        if (this.store.summaryOuts[j].date.toDateString() === cur.toDateString()) {
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
    const columnNames = ['Mission Date', 'Customer - Store', 'Total Aisles Scanned', 'Total # Of Labels', 'Total # Unread Labels',
    'Percentage Unread Labels', 'Percentage Read Labels', '# Read Labels With Matching Product', '# Read Labels Missing Product',
    'Total # OOS'];
    this.apiService.getMissions(this.storeId, this.graphStartDate, this.graphEndDate, this.store.timezone)
    .subscribe(
      missions => {
        const body = [];
        missions.forEach( mission => {
          let row = [];
          row = row.concat(mission.startDateTime.toLocaleString().replace(',', ''));
          row = row.concat(this.store.storeName);
          row = row.concat(mission.aisleCount);
          row = row.concat(mission.labels);
          row = row.concat(mission.unreadLabels);
          row = row.concat(mission.percentageUnread);
          row = row.concat(mission.percentageRead);
          row = row.concat(mission.readLabelsMatchingProduct);
          row = row.concat(mission.readLabelsMissingProduct);
          row = row.concat(mission.outs);
          body.push(row);
        });
        const filename = 'PerformanceData_' + this.graphStartDate.toDateString() + '-' +
          this.graphEndDate.toDateString() + '.csv';
        this.saveCSV(body, columnNames, filename);
      }
    );
  }

  exportAisleScanData() {
    const columnNames = ['Date Span', 'Aisle', '# Of Scans', 'Average Aisle Coverage'];
    this.apiService.getMissions(this.storeId, this.graphStartDate, this.graphEndDate, this.store.timezone)
    .subscribe(
      missions => {
        let aisles: Aisle[] = [];
        missions.forEach( mission => {
          aisles = aisles.concat(mission.aisles);
        });
        const coveragePercentages = new Map<string, number>();
        const scanCounts = new Map<string, number>();
        aisles.forEach( aisle => {
          let coveragePercent = aisle.coveragePercent;
          let scanCount = 1;
          if (coveragePercentages.has(aisle.aisleName)) {
            coveragePercent += coveragePercentages.get(aisle.aisleName);
          }
          if (scanCounts.has(aisle.aisleName)) {
            scanCount += scanCounts.get(aisle.aisleName);
          }
          coveragePercentages.set(aisle.aisleName, coveragePercent);
          scanCounts.set(aisle.aisleName, scanCount);
        });
        const body = [];
        coveragePercentages.forEach((value: number, key: string) => {
          let row = [];
          row = row.concat(this.graphStartDate.toDateString() + '-' + this.graphEndDate.toDateString());
          row = row.concat(key);
          row = row.concat(scanCounts.get(key));
          const coveragePercent = value / scanCounts.get(key);
          let avgAisleCoverage = 'Low';
          if (coveragePercent >= 70) {
            avgAisleCoverage = 'High';
          } else if (coveragePercent >= 40) {
            avgAisleCoverage = 'Medium';
          }
          if (this.coverageDisplayType.toLowerCase() === 'percent') {
            avgAisleCoverage = coveragePercent.toString();
          }
          row = row.concat(avgAisleCoverage);
          body.push(row);
        });
        const filename = 'ScanData_' + this.graphStartDate.toDateString() + '-' +
          this.graphEndDate.toDateString() + '.csv';
        this.saveCSV(body, columnNames, filename);
      }
    );
  }

  saveCSV(body: any[], columnNames, filename) {
    let csvString = columnNames.join(',') + '\n';
    for (let j = 0; j < body.length; j++) {
      csvString += body[j].join(',') + '\n';
    }
    const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8,%EF%BB%BF' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', csvUrl);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  requestData(modalId: string) {
    const dateDifference = this.requestEndDate.getTime() - this.requestStartDate.getTime();
    if (dateDifference > 0 && dateDifference < 1000 * 60 * 60 * 24 * 7) {
      this.currentlyRequesting = true;
      this.progress = 20;
      // this.modalService.close(modalId);
      this.error = false;
    } else {
      this.error = true;
    }
  }

  changeRequestDates(request: string, newDate: string) {
    if (request === 'start') {
      this.requestStartDate = new Date(new Date(newDate).toLocaleString('en-US', {timeZone: this.store.timezone}));
    } else {
      this.requestEndDate = new Date(newDate);
    }
  }
}
