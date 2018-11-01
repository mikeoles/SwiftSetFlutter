import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aisle';
  outs: any[];
  labels: any[];
  currentId: number;
  currentDisplay: string;

  constructor(private apiService: ApiService) {
    this.currentDisplay = 'outs';
  }

  ngOnInit() {
    this.apiService.getOuts().subscribe(outs => this.outs = outs);
    this.apiService.getLabels().subscribe(labels => this.labels = labels);
  }

  setId(id){
    this.currentId = id;
  }

  setDisplay(display){
    this.currentDisplay = display;
  }

}
