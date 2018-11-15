import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-data-display',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss']
})

export class StoreViewComponent implements OnInit {
  today: number = Date.now();
  @Input() missions: any[];
  spreadsData = [4, 5, 6, 7, 8, 2, 3, 4, 6, 7, 8, 2, 3, 4];
  labelsData = [5, 5, 6, 7, 8, 2, 3, 4, 6, 7, 8, 2, 3, 4];
  outsData = [6, 5, 6, 7, 8, 2, 3, 4, 6, 7, 8, 2, 3, 4];

  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    this.apiService.getMissions().subscribe(missions => this.missions = missions);
  }

}
