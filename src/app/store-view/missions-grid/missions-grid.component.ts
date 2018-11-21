import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-missions-grid',
  templateUrl: './missions-grid.component.html',
  styleUrls: ['./missions-grid.component.scss']
})
export class MissionsGridComponent implements OnInit {
  @Input() missions: any[];
  @Input() missionsDate: number;

  constructor() { }

  ngOnInit() {
  }

}
