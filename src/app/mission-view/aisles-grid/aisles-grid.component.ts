import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import Aisle from '../../aisle.model';
import { EnvironmentService } from 'src/app/environment.service';

@Component({
  selector: 'app-aisles-grid',
  templateUrl: './aisles-grid.component.html',
  styleUrls: ['./aisles-grid.component.scss']
})
export class AislesGridComponent implements OnInit {

  @Input() aisles: Aisle[];
  @Input() missionId: number;
  @Input() storeId: number;
  showAisleCoverage: boolean;

  constructor( private router: Router, private environment: EnvironmentService) {
    this.showAisleCoverage = environment.config.coveragePercent;
  }

  ngOnInit() {
  }

  viewAisle(aisleId: string) {
    this.router.navigate(['store/' + this.storeId + '/mission/' + this.missionId + '/aisle/' + aisleId]);
  }

}
