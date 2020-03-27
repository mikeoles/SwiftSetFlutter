import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { faAngleDown, faAngleUp, faArrowRight, faArrowLeft, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-debug-filters',
  templateUrl: './debug-filters.component.html',
  styleUrls: ['./debug-filters.component.scss']
})
export class DebugFiltersComponent implements OnInit {

  @Output() toggleFilter = new EventEmitter();
  @Input() filters: Map<string, boolean>;

  dropdownOpen = false;

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;


  constructor() { }

  ngOnInit() {
  }

  dropdownClicked() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectFilter(filterName: string) {
    this.toggleFilter.emit(filterName);
  }
}
