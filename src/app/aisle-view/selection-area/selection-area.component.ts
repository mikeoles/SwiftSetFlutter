import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { faAngleDown, faAngleUp, faArrowRight, faArrowLeft, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import Mission from '../../mission.model';
import Aisle from '../../aisle.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import Label from 'src/app/label.model';
import { ModalService } from '../../modal/modal.service';
import { EnvironmentService } from 'src/app/environment.service';
import { ApiService } from 'src/app/api.service';
import Store from 'src/app/store.model';
import panzoom from 'panzoom';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { Permissions } from 'src/permissions/permissions';
import { Roles } from 'src/permissions/roles';

@Component({
  selector: 'app-selection-area',
  templateUrl: './selection-area.component.html',
  styleUrls: ['./selection-area.component.scss']
})
export class SelectionAreaComponent implements OnInit, OnChanges {
  store: Store;
  currentDropdown = '';
  showExportButtons = false;

  showTopStock = false;
  showSectionLabels = false;
  showSectionBreaks = false;
  showQA = false;
  showMisreadBarcodes = false;

  @Input() missions: Mission[];
  @Input() aisles: Aisle[];
  @Input() selectedMission: Mission;
  @Input() selectedAisle: Aisle;
  @Input() panoTouched: boolean;
  @Input() panoramaUrl: string;
  @Input() outs: Label[] = [];
  @Input() labels: Label[] = [];
  @Input() currentlyDisplayed: Set<string>;
  @Input() qaMode: boolean;

  @Output() missionSelected = new EventEmitter();
  @Output() aisleSelected = new EventEmitter();
  @Output() resetPano = new EventEmitter();
  @Output() resetPanoAfterExport = new EventEmitter();
  @Output() toggleQAMode = new EventEmitter();
  @Output() toggleDisplayed = new EventEmitter();

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;

  currentlyExporting = false;

  constructor(private eRef: ElementRef,
              private modalService: ModalService,
              private environment: EnvironmentService,
              private apiService: ApiService,
              private router: Router) {
    this.showExportButtons = environment.config.showExportButtons;
    this.showMisreadBarcodes = environment.config.showMisreadBarcodes;

    const context = this;
    this.apiService.getRoles(localStorage.getItem('id_token')).subscribe( role => {
      if (typeof context.environment.setPermissions === 'function') {
        context.environment.setPermissions(Roles[role]);
      }
      context.showTopStock = environment.config.permissions.indexOf(Permissions.topStock) > -1;
      context.showSectionLabels = environment.config.permissions.indexOf(Permissions.sectionLabels) > -1;
      context.showSectionBreaks = environment.config.permissions.indexOf(Permissions.sectionBreaks) > -1;
      context.showQA = environment.config.permissions.indexOf(Permissions.QA) > -1;
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['panoTouched']) {
      this.panoTouched = false;
      this.currentDropdown = '';
    }
    if (changes['missions'] && this.missions) {
      this.missions.sort(this.missionSort);
    }
  }

  missionSort(a: Mission, b: Mission) {
    if (a.startDateTime < b.startDateTime) {
      return 1;
    }
    if (a.startDateTime > b.startDateTime) {
      return -1;
    }
    return 0;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!event.target.classList.contains('dropdownButton')) {
      this.currentDropdown = '';
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
    this.currentDropdown = '';
  }

  aisleChanged(aisle) {
    this.aisleSelected.emit(aisle);
    this.currentDropdown = '';
  }

  displaySelected(display: string) {
    this.toggleDisplayed.emit(display);
  }

  qaModeClick() {
    this.toggleQAMode.emit();
  }

  openDropdown(name: string) {
    this.currentDropdown = this.currentDropdown === name ? '' : name;
  }

  resetPanoClick() {
    this.resetPano.emit();
  }

  exportAisle(exportType: string, modalId: string) {
    this.currentlyExporting = true;
    const exportFields: string[] = this.environment.config.exportFields;
    let csvContent = exportFields.join(',') + '\n';

    const exportData: Label[] = exportType === 'labels' ? this.labels : this.outs;
    exportData.sort(this.labelLocationSort);
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
      for (let i = 0; i < row.length; i++) {
        if (typeof row[i] === 'string') {
          row[i] = row[i].replace(/"/g, '""');
          if (row[i].includes('\n') || row[i].includes(',') || row[i].includes('"')) {
            row[i] = '"' + row[i] + '"';
          }
        }
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
    this.apiService.getStore(this.selectedMission.storeId, new Date(), new Date()).subscribe(store => {
      const doc = new jsPDF('landscape');
      const exportFields: string[] = this.environment.config.exportFields;
      const head = [this.environment.config.exportFields];
      const body = [];

      const exportData: Label[] = this.outs;
      exportData.sort(this.labelLocationSort);
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
      const rightText =  this.selectedMission.startDateTime.toLocaleString();
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

  exportPano(modalId: string) {
    const element = document.getElementById('pano-image');
    this.currentlyExporting = true;
    const context = this;
    panzoom(element, {
      maxZoom: 1,
      minZoom: 1,
    });
    setTimeout(() => {
      htmlToImage.toBlob(document.getElementById('pano-image'))
      .then(function (blob) {
        saveAs(blob, 'pano.jpg');
        context.currentlyExporting = false;
        context.modalService.close(modalId);
        context.resetPanoAfterExport.emit();
      });
    },
    1000);
  }

  nextPano() {
    const index: number = this.findAisleIndex();
    if (index >= 0 && index < this.aisles.length - 1) {
      this.aisleSelected.emit(this.aisles[index + 1]);
    }
  }

  previousPano() {
    const index: number = this.findAisleIndex();
    if (index > 0) {
      this.aisleSelected.emit(this.aisles[index - 1]);
    }
  }

  findAisleIndex() {
    let index = -1;
    this.aisles.forEach((aisle, i) => {
      if (aisle.aisleId === this.selectedAisle.aisleId) {
        index = i;
      }
    });
    return index;
  }

  labelLocationSort(a: Label, b: Label) {
    if (a.bounds.left > b.bounds.left) {
      return 1;
    }
    if (a.bounds.left < b.bounds.left) {
      return -1;
    }
    return 0;
  }
}
