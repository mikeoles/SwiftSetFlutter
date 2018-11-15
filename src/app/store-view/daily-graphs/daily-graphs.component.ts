import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-daily-graphs',
  templateUrl: './daily-graphs.component.html',
  styleUrls: ['./daily-graphs.component.scss']
})
export class DailyGraphsComponent implements OnInit {
  @Input() data: any[];
  @Input() title: string;
  today: number;
  average: number;

  constructor() { }

  ngOnInit() {
    let total = 0;
    for (const d of this.data) {
      total += d;
    }
    this.average = total / this.data.length;
    this.today = this.data[this.data.length - 1];
  }

}
