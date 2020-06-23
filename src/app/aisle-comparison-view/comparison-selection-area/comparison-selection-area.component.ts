import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import Mission from 'src/app/models/mission.model';
import Aisle from 'src/app/models/aisle.model';

@Component({
  selector: 'app-comparison-selection-area',
  templateUrl: './comparison-selection-area.component.html',
  styleUrls: ['./comparison-selection-area.component.scss']
})
export class ComparisonSelectionAreaComponent implements OnInit {

  @Input() missions: Mission[];
  @Input() aisles: Aisle[];
  @Input() comparableAisles: Aisle[];
  @Input() selectedMission: Mission;
  @Input() selectedAisle: Aisle;
  @Input() selectedComparisonAisle: Aisle;

  @Output() missionSelected = new EventEmitter();
  @Output() aisleSelected = new EventEmitter();
  @Output() comparisonAisleSelected = new EventEmitter();

  currentDropdown = '';
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor() { }

  ngOnInit() {
  }

  openDropdown(name: string) {
    this.currentDropdown = this.currentDropdown === name ? '' : name;
  }

  missionChanged(mission) {
    this.missionSelected.emit(mission);
    this.currentDropdown = '';
  }

  aisleChanged(aisle) {
    this.aisleSelected.emit(aisle);
    this.currentDropdown = '';
  }

  comparisonAisleChanged(aisle) {
    this.comparisonAisleSelected.emit(aisle);
    this.currentDropdown = '';
  }
}
