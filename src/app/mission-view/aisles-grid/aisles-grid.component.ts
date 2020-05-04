import { Component, OnInit, Input } from '@angular/core';
import Aisle from '../../models/aisle.model';
import { EnvironmentService } from 'src/app/services/environment.service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

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
  sortType = 'aisleName';
  sortReverse = false;

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private environment: EnvironmentService) {
    this.showAisleCoverage = this.environment.config.coveragePercent;
  }

  ngOnInit() {
  }

  sortBy(type: string) {
    if (this.sortType === type) {
      this.sortReverse = !this.sortReverse;
    }
    this.sortType = type;
  }

  sortAisles() {
    if (this.sortReverse) {
      return this.aisles.sort((a, b) => a[this.sortType] < b[this.sortType] ? 1 : a[this.sortType] === b[this.sortType] ? 0 : -1);
    }
    return this.aisles.sort((a, b) => a[this.sortType] > b[this.sortType] ? 1 : a[this.sortType] === b[this.sortType] ? 0 : -1);
  }
}
