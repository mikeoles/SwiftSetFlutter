import { Component, OnInit, Input } from '@angular/core';
import Aisle from '../../models/aisle.model';
import { EnvironmentService } from 'src/app/services/environment.service';

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

  constructor(private environment: EnvironmentService) {
    this.showAisleCoverage = this.environment.config.coveragePercent;
  }

  ngOnInit() {
  }
}
