import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss']
})

export class StoreViewComponent implements OnInit {
  missions: any[];
  store: any;
  storeId: number;
  selectedIndex: number;
  selectedDate: string;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        this.storeId = params['id'];
      }
    });
    this.apiService.getStore(this.storeId).subscribe(store => this.store = store);
  }

  ngOnInit() {
  }

  setIndex(selectedValues) {
    this.selectedIndex = selectedValues.index;
    this.selectedDate = selectedValues.date;
    this.apiService.getDateMissions(this.selectedDate).subscribe(missions => this.missions = missions);
  }

}
