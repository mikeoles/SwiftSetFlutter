import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { faAngleDown, faAngleUp, faArrowRight, faArrowLeft, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import Mission from '../../models/mission.model';
import Aisle from '../../models/aisle.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import Label from 'src/app/models/label.model';
import { ModalService } from '../../services/modal.service';
import { EnvironmentService } from 'src/app/services/environment.service';
import { ApiService } from 'src/app/services/api.service';
import Store from 'src/app/models/store.model';
import { LabelType } from 'src/app/shared/label-type';
import {Location} from '@angular/common';

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
  showDebugButton = false;
  showPreviouslySeenBarcodes = true;

  @Input() missions: Mission[];
  @Input() aisles: Aisle[];
  @Input() selectedMission: Mission;
  @Input() selectedAisle: Aisle;
  @Input() panoramaUrl: string;
  @Input() labels = new Map<LabelType, Array<Label>>();
  @Input() labelsChanged: boolean;
  @Input() currentlyDisplayed: Set<string>;
  @Input() qaMode: boolean;

  @Output() missionSelected = new EventEmitter();
  @Output() aisleSelected = new EventEmitter();
  @Output() resetPano = new EventEmitter();
  @Output() toggleQAMode = new EventEmitter();
  @Output() toggleDisplayed = new EventEmitter();
  @Output() exportPano = new EventEmitter();

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
              private location: Location) {
    this.showExportButtons = environment.config.showExportButtons;
    this.showMisreadBarcodes = environment.config.showMisreadBarcodes;
    this.showSectionLabels = environment.config.showSectionLabels;
    this.showTopStock = environment.config.showTopStock;
    this.showSectionBreaks = environment.config.showSectionBreaks;
    this.showDebugButton = environment.config.showDebugButton;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
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

  // open debug view in new tab
  debugClick() {
    let url = this.location.path();
    const hasParameters = url.indexOf('?');
    url = url.substring(0, hasParameters !== -1 ? hasParameters : url.length);
    window.open(url + '/debug', '_blank');
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

    const labelsToExport: LabelType = exportType === 'shelfLabels' ? LabelType.shelfLabels : LabelType.outs;
    const exportData: Array<Label> = this.labels.get(labelsToExport);    exportData.sort(this.labelLocationSort);
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

      const exportData: Array<Label> = this.labels.get(LabelType.outs);
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

  exportPanoClicked(modalId: string) {
    this.exportPano.emit();
    this.modalService.close(modalId);
  }

  nextPano() {
    const index = this.aisles.findIndex(a => a.aisleId === this.selectedAisle.aisleId);
    if (index >= 0 && index < this.aisles.length - 1) {
      this.aisleSelected.emit(this.aisles[index + 1]);
    }
  }

  previousPano() {
    const index = this.aisles.findIndex(a => a.aisleId === this.selectedAisle.aisleId);
    if (index > 0) {
      this.aisleSelected.emit(this.aisles[index - 1]);
    }
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
