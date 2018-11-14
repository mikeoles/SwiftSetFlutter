import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stat-ring',
  templateUrl: './stat-ring.component.html',
  styleUrls: ['./stat-ring.component.scss']
})
export class StatRingComponent implements OnInit {
  @Input() max: number;
  @Input() current: number;
  @Input() title: string;
  @Input() stat: string;
  @Input() time: boolean;
  percentage: number;

  constructor() {
    this.percentage = 80;
  }

  ngOnInit() {
  }
}
