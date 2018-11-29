import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@angular/common';
import Mission from '../mission.model';
import Aisle from '../aisle.model';

@Component({
  selector: 'app-selection-area',
  templateUrl: './selection-area.component.html',
  styleUrls: ['./selection-area.component.scss']
})
export class SelectionAreaComponent implements OnInit {
  showMissions = false;
  showAisles = false;
  @Input() missions: Mission[];
  @Input() aisles: Aisle[];
  @Input() selectedMission: Mission;
  @Input() selectedAisle: Aisle;
  @Output() missionSelected = new EventEmitter();
  @Output() aisleSelected = new EventEmitter();
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  ngOnInit() {
  }

  missionChanged(mission) {
    this.missionSelected.emit(mission);
    this.showMissions = false;
  }

  aisleChanged(aisle) {
    this.aisleSelected.emit(aisle);
    this.showAisles = false;
  }

  selectMissionsDropdown() {
    this.showMissions = !this.showMissions;
    this.showAisles = false;
  }

  selectAislesDropdown() {
    this.showAisles = !this.showAisles;
    this.showMissions = false;
  }

  missionName(mission: Mission) {
    const formatted = formatDate(mission.missionDateTime, 'M/d/yyyy', 'en-US');
    return `${formatted} - ${mission.name}`;
  }
}
