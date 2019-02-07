import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@angular/common';
import Mission from '../../mission.model';
import Aisle from '../../aisle.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import Label from 'src/app/label.model';

@Component({
  selector: 'app-selection-area',
  templateUrl: './selection-area.component.html',
  styleUrls: ['./selection-area.component.scss']
})
export class SelectionAreaComponent implements OnInit, OnChanges {
  showMissions = false;
  showAisles = false;
  @Input() missions: Mission[];
  @Input() aisles: Aisle[];
  @Input() selectedMission: Mission;
  @Input() selectedAisle: Aisle;
  @Input() panoTouched: boolean;
  @Input() panoramaUrl: string;
  @Input() outs: Label[] = [];
  @Output() missionSelected = new EventEmitter();
  @Output() aisleSelected = new EventEmitter();
  @Output() panoSwitch = new EventEmitter();
  @Output() resetPano = new EventEmitter();
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private eRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['panoTouched']) {
      this.panoTouched = false;
      this.showAisles = false;
      this.showMissions = false;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!event.target.classList.contains('dropdownButton')) {
      this.showMissions = false;
      this.showAisles = false;
    }
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

  logoClicked() {
    this.panoSwitch.emit();
  }

  resetPanoClick() {
    this.resetPano.emit();
  }

  exportPDF() {
    const doc = new jsPDF();

    const img = new Image();
    img.src = this.panoramaUrl;
    doc.addImage(img, 'PNG', 5, 10, 200, 76);

    const body = [];
    const head = [['Product Name', 'Barcode', 'Product Id', 'Price']];
    for (let i = 0; i < this.outs.length ; i++) {
      const row = [this.outs[i].name, this.outs[i].barcode, this.outs[i].productId, this.outs[i].price];
      body.push(row);
    }

    doc.autoTable({head: head, body: body, startY: 90});
    doc.save(this.selectedMission.name + '-' + this.selectedAisle.name + '.pdf');
  }
}
