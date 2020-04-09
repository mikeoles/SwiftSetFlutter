import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { faAngleDown, faAngleUp, faArrowRight, faArrowLeft, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-debug-filters',
  templateUrl: './debug-filters.component.html',
  styleUrls: ['./debug-filters.component.scss']
})
export class DebugFiltersComponent implements OnInit {

  @Output() toggleFilters = new EventEmitter<{filterName: string, filterValue: string}>();
  @Input() classifications: Map<string, boolean>;
  @Input() detectionTypes: Map<string, boolean>;
  @Input() tags: Map<string, boolean>;

  detectionsTypesDropdown = false;
  classificationsDropdown = false;
  tagsDropdown = false;

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;


  constructor() { }

  ngOnInit() {
  }

  dropdownClicked(filterName: string) {
    switch (filterName) {
      case 'detectionTypes':
        this.detectionsTypesDropdown = !this.detectionsTypesDropdown;
        this.tagsDropdown = false;
        this.classificationsDropdown = false;
        break;
      case 'tags':
        this.tagsDropdown = !this.tagsDropdown;
        this.detectionsTypesDropdown = false;
        this.classificationsDropdown = false;
        break;
      case 'classifications':
        this.classificationsDropdown = !this.classificationsDropdown;
        this.tagsDropdown = false;
        this.detectionsTypesDropdown = false;
        break;
    }
  }

  selectFilter(filterName: string, filterValue: string) {
  this.toggleFilters.emit({
      filterName: filterName,
      filterValue: filterValue
    });
  }
}
