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

  flaggedCoverageDelta: number;
  sortType = 'aisleName';
  sortReverse = false;

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private environment: EnvironmentService) {
    this.flaggedCoverageDelta = this.environment.config.flaggedCoverageDelta;
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

  // Change the display color of aisles with coverage deltas lower than the configured flagged coverage delta
  setDeltaStyle(coverageDelta: number) {
    const styles = {};
    styles['color'] = 'black';
    if (coverageDelta <= this.flaggedCoverageDelta) {
      styles['color'] = 'red';
    }
    return styles;
  }
}
