import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss']
})

export class StoreViewComponent implements OnInit {
  missions: any[];
  summary: any;
  selectedIndex: string;
  selectedDate: string;

  constructor(private apiService: ApiService) {
    this.apiService.getMissionSummaries().subscribe(summaries => this.summary = summaries);
  }

  ngOnInit() {
  }

  setIndex(selectedValues) {
    this.selectedIndex = selectedValues.index;
    this.selectedDate = selectedValues.date;
    this.apiService.getMissions(this.selectedDate).subscribe(missions => this.missions = missions);
  }

}
