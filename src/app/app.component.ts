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
  currentIndex: Number;
  currentDisplay: String;

  constructor(private apiService: ApiService) {
    this.currentDisplay = 'outs';
  }

  ngOnInit() {
    this.apiService.getOuts().subscribe(outs => this.outs = outs);
  }

  gridId(index){
    this.currentIndex = index;
  }

  gridDisplay(display){
    this.currentDisplay = display;
  }

  panoramaId(index){
    this.currentIndex = index;
  }
  
  panoramaDisplay(display){
    this.currentDisplay = display;
  }

}
