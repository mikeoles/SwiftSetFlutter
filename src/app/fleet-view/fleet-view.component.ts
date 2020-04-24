import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fleet-view',
  templateUrl: './fleet-view.component.html',
  styleUrls: ['./fleet-view.component.scss']
})
export class FleetViewComponent implements OnInit {

  bossanovaUser = false;
  customerUser = true;

  constructor() { }

  ngOnInit() {}
}
