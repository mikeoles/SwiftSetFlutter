import { Component, OnInit, Input } from '@angular/core';
import Aisle from '../../../models/aisle.model';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
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

  sortType = 'aisleName';
  sortReverse = false;
  aisleGridCounts = [];
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private environment: EnvironmentService) {
    this.aisleGridCounts = this.environment.config.aisleGridCounts;
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

  // reformat count variable to readable header: sectionLabelCount -> Section Label Count
  formatHeader(countName: string) {
    if (countName === 'labelUnreadCount') {
      return 'Misread Barcodes';
    }
    let result = countName.replace( /([A-Z])/g, ' $1' );
    result = result.charAt(0).toUpperCase() + result.slice(1);
    result = result.substring(0, result.length - 6);
    return result += 's';
  }
}
