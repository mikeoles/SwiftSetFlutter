import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss']
})

export class StoreViewComponent implements OnInit {
  missions: any[];
  selectedIndex: string;
  selectedDate: string;
  spreadsData: any[];
  labelsData: any[];
  outsData: any[];
  spreadsAverage: number;
  labelsAverage: number;
  outsAverage: number;

  constructor(private apiService: ApiService) {
    this.apiService.getMissionSummaries().subscribe(summaries => this.outsData = summaries.outs);
    this.apiService.getMissionSummaries().subscribe(summaries => this.outsAverage = summaries.AverageOuts);
    this.apiService.getMissionSummaries().subscribe(summaries => this.spreadsData = summaries.spreads);
    this.apiService.getMissionSummaries().subscribe(summaries => this.spreadsAverage = summaries.AverageSpreads);
    this.apiService.getMissionSummaries().subscribe(summaries => this.labelsData = summaries.labels);
    this.apiService.getMissionSummaries().subscribe(summaries => this.labelsAverage = summaries.AverageLabels);
  }

  ngOnInit() {
  }

  setIndex(selectedValues) {
    this.selectedIndex = selectedValues.index;
    this.selectedDate = selectedValues.date;
    this.apiService.getMissions(this.selectedDate).subscribe(missions => this.missions = missions);
  }

}
