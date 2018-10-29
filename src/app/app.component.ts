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

  setId(index){
    this.currentIndex = index;
  }

  setDisplay(display){
    this.currentDisplay = display;
  }

}
