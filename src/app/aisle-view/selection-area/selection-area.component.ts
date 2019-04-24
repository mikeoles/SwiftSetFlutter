import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import Mission from '../../mission.model';
import Aisle from '../../aisle.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import Label from 'src/app/label.model';
import { ModalService } from '../../modal/modal.service';
import { EnvironmentService } from 'src/app/environment.service';
import { ApiService } from 'src/app/api.service';
import Store from 'src/app/store.model';

@Component({
  selector: 'app-selection-area',
  templateUrl: './selection-area.component.html',
  styleUrls: ['./selection-area.component.scss']
})
export class SelectionAreaComponent implements OnInit, OnChanges {
  showMissions = false;
  showAisles = false;
  exportOnHand = false;
  exportingPDF = false;
  displayExclusionButton = false;
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
  @Output() toggleExclusionZone = new EventEmitter();
  store: Store;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  currentlyExporting = false;

  constructor(private eRef: ElementRef, private modalService: ModalService, private environment: EnvironmentService,
    @Inject('ApiService') private apiService: ApiService) {
    this.exportOnHand = environment.config.onHand;
    this.exportingPDF = environment.config.exportingPDF;
    this.displayExclusionButton = environment.config.exclusionZones;
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
    this.currentlyExporting = true;
    const exportFields: string[] = this.environment.config.exportFields;
    let csvContent = exportFields.join(',') + '\n';

    const exportData: Label[] = exportType === 'labels' ? this.labels : this.outs;
    for (let j = 0; j < exportData.length; j++) {
      const label: Label = exportData[j];
      if (exportType === 'onhand' && (label.onHand === null || label.onHand < 1)) {
        continue;
      }
      let row = [];
      for (let k = 0; k < exportFields.length; k++) {
        const field: string = exportFields[k];
        let fieldLowercase = field.charAt(0).toLowerCase() + field.slice(1);
        fieldLowercase = fieldLowercase.replace(/\s/g, '');
        if (fieldLowercase === 'description') {
          fieldLowercase = 'labelName';
        }
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

    const csvData = new Blob([csvContent], { type: 'text/csv;charset=utf-8,%EF%BB%BF' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', csvUrl);
    link.setAttribute('download', 'Aisle-' + this.selectedAisle.aisleName + '-' + exportType + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.currentlyExporting = false;
  }

  exportPDF(modalId: string) {
    this.currentlyExporting = true;
    const day: Date = new Date();
    this.apiService.getStore(this.selectedMission.storeId, day, Intl.DateTimeFormat().resolvedOptions().timeZone).subscribe(store => {
      const doc = new jsPDF('landscape');
      const exportFields: string[] = this.environment.config.exportFields;
      const head = [this.environment.config.exportFields];
      const body = [];

      const exportData: Label[] = this.outs;
      for (let j = 0; j < exportData.length; j++) {
        const label: Label = exportData[j];
        if (label.onHand === null || label.onHand < 1) {
          continue;
        }
        let row = [];
        for (let k = 0; k < exportFields.length; k++) {
          const field: string = exportFields[k];
          let fieldLowercase = field.charAt(0).toLowerCase() + field.slice(1);
          fieldLowercase = fieldLowercase.replace(/\s/g, '');
          if (fieldLowercase === 'description') {
            fieldLowercase = 'labelName';
          }
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
        body.push(row);
      }

      const middleText = 'On Hand';
      const middleWidth = doc.getStringUnitWidth(middleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const middleOffset = (doc.internal.pageSize.width - middleWidth) / 2;
      const rightText =  this.selectedMission.missionDateTime.toLocaleString();
      const rightWidth = doc.getStringUnitWidth(rightText.toString()) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const rightOffset = (doc.internal.pageSize.width - rightWidth) - 20;

      doc.text(middleOffset, 10, middleText);
      doc.text(rightOffset, 10, rightText);
      doc.text(20, 10, store.storeName);

      doc.autoTable({head: head, body: body, startY: 15, styles: {cellPadding: 0.5, fontSize: 9}});
      doc.save(this.selectedMission.missionName + '-' + this.selectedAisle.aisleName + '.pdf');
      this.modalService.close(modalId);
    });
    this.currentlyExporting = false;
  }

  toggleExclusionZones() {
    this.toggleExclusionZone.emit();
  }
}
