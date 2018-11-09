import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-selection-area',
  templateUrl: './selection-area.component.html',
  styleUrls: ['./selection-area.component.scss']
})
export class SelectionAreaComponent implements OnInit {
  @Input() missions: any[];
  @Input() aisles: any[];
  @Input() missionId: number;
  @Input() aisleId: string;
  @Output() selectedMission = new EventEmitter();
  @Output() selectedAisle = new EventEmitter();

  ngOnInit() {
  }

  missionChanged() {
    this.selectedMission.emit(this.missionId);
  }

  aisleChanged() {
    this.selectedAisle.emit(this.aisleId);
  }

}
