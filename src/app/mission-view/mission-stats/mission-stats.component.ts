import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mission-stats',
  templateUrl: './mission-stats.component.html',
  styleUrls: ['./mission-stats.component.scss']
})
export class MissionStatsComponent implements OnInit {
  @Input() title: string;
  @Input() average: number;
  @Input() total: number;

  constructor() {
  }

  ngOnInit() {
  }
}
