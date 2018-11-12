import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-selection-area',
  templateUrl: './selection-area.component.html',
  styleUrls: ['./selection-area.component.scss']
})
export class SelectionAreaComponent implements OnInit {
  showMissions = false;
  showAisles = false;
  @Input() missions: any[];
  @Input() aisles: any[];
  @Input() missionId: number;
  @Input() aisleId: string;
  @Output() selectedMission = new EventEmitter();
  @Output() selectedAisle = new EventEmitter();
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  ngOnInit() {
  }

  missionChanged(mission) {
    this.selectedMission.emit(mission.Id);
    this.showMissions = false;
  }

  aisleChanged(aisle) {
    this.selectedAisle.emit(aisle.Id);
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

}
