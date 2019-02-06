import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@angular/common';
import Mission from '../../mission.model';
import Aisle from '../../aisle.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import Label from 'src/app/label.model';
import { ModalService } from '../../services/modal.service';

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
  @Input() labels: Label[] = [];
  @Output() missionSelected = new EventEmitter();
  @Output() aisleSelected = new EventEmitter();
  @Output() panoSwitch = new EventEmitter();
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private eRef: ElementRef, private modalService: ModalService) {
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

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
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

  exportAisle(exportType: string, modalId: string) {
    const showAllLabels = exportType === 'labels';
    let headers = ['Barcode',
      'Location'];
    if (showAllLabels) {
      headers = headers.concat('Out Of Stock');
    }
    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF';
    csvContent += headers.join(',') + '\n';

    const outsBarcodes: Set<string> = new Set<string>();
    for (let j = 0; j < this.outs.length; j++) {
      outsBarcodes.add(this.outs[j].barcode);
    }
    for (let j = 0; j < this.labels.length; j++) {
      let row = [
        '\'' + this.labels[j].barcode ,
        'X: ' + this.labels[j].bounds.left + ' Y: ' + this.labels[j].bounds.top,
      ].join(',');

      const outOfStock: Boolean = outsBarcodes.has(this.labels[j].barcode);

      if (showAllLabels) {
        row = row.concat(',' + outOfStock.toString());
      }

      if (showAllLabels || outOfStock) {
        csvContent += row + '\n';
      }
    }
    this.modalService.close(modalId);

    // do the download stuff
    const encodedUri = csvContent;
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Aisle-' + this.selectedAisle.name + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
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
