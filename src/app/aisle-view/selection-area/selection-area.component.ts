import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import Mission from '../../mission.model';
import Aisle from '../../aisle.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import Label from 'src/app/label.model';
import { ModalService } from '../../modal/modal.service';
import { EnvironmentService } from 'src/app/environment.service';

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
  @Output() resetPano = new EventEmitter();
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private eRef: ElementRef, private modalService: ModalService, private environment: EnvironmentService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['panoTouched']) {
      this.panoTouched = false;
      this.showAisles = false;
      this.showMissions = false;
    }
    if (changes['missions'] && this.missions) {
      this.missions.sort(this.missionSort);
    }
  }

  missionSort(a: Mission, b: Mission) {
    if (a.missionDateTime < b.missionDateTime) {
      return 1;
    }
    if (a.missionDateTime > b.missionDateTime) {
      return -1;
    }
    return 0;
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

  resetPanoClick() {
    this.resetPano.emit();
  }

  exportAisle(exportType: string, modalId: string) {
    const exportFields: string[] = this.environment.config.exportFields;
    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF';
    csvContent += exportFields.join(',') + '\n';

    const exportData: Label[] = exportType === 'labels' ? this.labels : this.outs;
    for (let j = 0; j < exportData.length; j++) {
      const label: Label = exportData[j];
      let row = [];
      for (let k = 0; k < exportFields.length; k++) {
        const field: string = exportFields[k];
        let fieldLowercase = field.charAt(0).toLowerCase() + field.slice(1);
        fieldLowercase = fieldLowercase.replace(/\s/g, '');
        let cellValue = '';
        if (label[fieldLowercase]) {
          cellValue = label[fieldLowercase];
        } else if (this.selectedAisle[fieldLowercase]) {
          cellValue = this.selectedAisle[fieldLowercase];
        } else if (this.selectedMission[fieldLowercase]) {
          cellValue = this.selectedMission[fieldLowercase].toString();
        } else if (label.bounds[fieldLowercase]) {
          cellValue = label.bounds[fieldLowercase];
        } else {
          for (let l = 0; l < label.customFields.length; l++) {
            if (label.customFields[l].name === field) {
              cellValue = label.customFields[l].value;
            }
          }
        }
        row = row.concat(cellValue);
      }
      csvContent += row.join(',') + '\n';
    }
    this.modalService.close(modalId);

    // do the download stuff
    const encodedUri = csvContent;
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Aisle-' + this.selectedAisle.aisleName + '-' + exportType + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  exportPDF() {
    const doc = new jsPDF('landscape');

    const img = new Image();
    img.src = this.panoramaUrl;
    doc.addImage(img, 'PNG', 5, 50, 285, 80);

    const body = [];
    const head = [['Product Name', 'Barcode', 'Product Id', 'Price']];
    for (let i = 0; i < this.outs.length ; i++) {
      const row = [this.outs[i].labelName, this.outs[i].barcode, this.outs[i].productId, this.outs[i].price];
      body.push(row);
    }

    doc.addPage();
    doc.autoTable({head: head, body: body, startY: 5});
    doc.save(this.selectedMission.missionName + '-' + this.selectedAisle.aisleName + '.pdf');
  }
}
