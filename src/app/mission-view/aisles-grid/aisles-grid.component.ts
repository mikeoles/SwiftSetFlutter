import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import Aisle from '../../aisle.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-aisles-grid',
  templateUrl: './aisles-grid.component.html',
  styleUrls: ['./aisles-grid.component.scss']
})
export class AislesGridComponent implements OnInit {

  @Input() aisles: Aisle[];
  @Input() missionId: number;
  showPercentScanned: boolean;

  constructor( private router: Router) {
    this.showPercentScanned = environment.coveragePercent;
  }

  ngOnInit() {
  }

  viewAisle(aisleId: string) {
    this.router.navigate(['mission/' + this.missionId + '/aisle/' + aisleId]);
  }

}
