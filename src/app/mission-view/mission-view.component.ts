import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import Mission from '../models/mission.model';
import Label from '../models/label.model';
import Store from '../models/store.model';
import { ModalService } from '../modal/modal.service';
import { BackService } from '../services/back.service';
import { Subscription } from 'rxjs';
import { EnvironmentService } from '../services/environment.service';
import { DataService } from '../services/data.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss'],
})

export class MissionViewComponent implements OnInit, OnDestroy {
  mission: Mission;
  store: Store;
  averageLabels: number;
  averageStoreOuts: number;
  averageStoreLabels: number;
  service: ApiService;
  currentlyExporting = false;
  showExportButtons = false;

  private backButtonSubscription: Subscription;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router,
    private modalService: ModalService, private backService: BackService, private environment: EnvironmentService,
    public dataService: DataService) {
      this.showExportButtons = environment.config.showExportButtons;
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('style', 'position: relative; overflow: auto;');
    const html = document.getElementsByTagName('html')[0];
    html.setAttribute('style', 'position: relative; overflow: auto;');
    this.backButtonSubscription = this.backService.backClickEvent().subscribe(() => this.goBack());
    let missionId: string, storeId: string;
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        missionId = params['missionId'];
      }
      if (params['storeId'] !== undefined) {
        storeId = params['storeId'];
      }
    });
    this.apiService.getMission(storeId, missionId, Intl.DateTimeFormat().resolvedOptions().timeZone).subscribe(mission => {
      this.mission = mission;
      this.apiService.getStore(mission.storeId, new Date(), new Date()).subscribe(store => {
        this.store = store;
        // If this page was nagivates to from the store view, show the two week average from there, if not show the last two weeks average
        this.averageStoreLabels = this.dataService.averageStoreLabels
          ? this.dataService.averageStoreLabels : this.store.totalAverageLabels;
        this.averageStoreOuts = this.dataService.averageStoreOuts
          ? this.dataService.averageStoreOuts : this.store.totalAverageOuts;
      });
    });
    this.service = this.apiService;
}

  goBack(): void {
    this.router.navigate(['/store/' + this.store.storeId]);
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  exportMission(exportType: string, modalId: string, fileType: string) {
    this.currentlyExporting = true;
    const exportFields: string[] = this.environment.config.exportFields;
    const body = [];
    this.addAisles(0, exportType, exportFields, modalId, body, fileType);
  }

  addAisles(i: number, exportType: string, exportFields: string[], modalId: string, body: any[], fileType: string) {
    if (i === this.mission.aisles.length) {
      if (fileType === 'pdf') {
        this.exportPDF(body);
      } else {
        this.exportCSV(exportType, body, exportFields);
      }
      this.modalService.close(modalId);
    } else {
      this.apiService.getAisle(this.mission.storeId, this.mission.missionId, this.mission.aisles[i].aisleId).subscribe(aisle => {
        const outs: Label[] = aisle.outs;
        const labels: Label[]  = aisle.labels;
        const exportData: Label[] = exportType === 'labels' ? labels : outs;
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
            } else if (aisle[fieldLowercase]) {
              cellValue = aisle[fieldLowercase];
            } else if (this.mission[fieldLowercase]) {
              cellValue = this.mission[fieldLowercase];
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
        this.addAisles(i + 1, exportType, exportFields, modalId, body, fileType);
      });
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

  exportCSV(exportType: string, body: any[], exportFields: string[]) {
    let csvString = exportFields.join(',') + '\n';
    for (let j = 0; j < body.length; j++) {
      const row = [...body[j]];
      for (let i = 0; i < row.length; i++) {
        if (typeof row[i] === 'string') {
          row[i] = row[i].replace(/"/g, '""');
          if (row[i].includes('\n') || row[i].includes(',') || row[i].includes('"')) {
            row[i] = '"' + row[i] + '"';
          }
        }
      }
      csvString += row.join(',') + '\n';
    }
    const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8,%EF%BB%BF' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', csvUrl);
    link.setAttribute('download', 'Mission-' + this.mission.missionName + '-' + exportType + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.currentlyExporting = false;
  }

  exportPDF(body: any[]) {
    this.currentlyExporting = true;
    const doc = new jsPDF('landscape');
    const head = [this.environment.config.exportFields];
    const middleText = 'On Hand';
    const middleWidth = doc.getStringUnitWidth(middleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const middleOffset = (doc.internal.pageSize.width - middleWidth) / 2;
    const rightText =  this.mission.startDateTime.toLocaleString();
    const rightWidth = doc.getStringUnitWidth(rightText.toString()) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const rightOffset = (doc.internal.pageSize.width - rightWidth) - 20;
    doc.text(middleOffset, 10, middleText);
    doc.text(rightOffset, 10, rightText);
    doc.text(20, 10, this.store.storeName);
    doc.autoTable({head: head, body: body, startY: 15, styles: {cellPadding: 0.5, fontSize: 9}});
    doc.save(this.mission.missionName + '.pdf');
    this.currentlyExporting = false;
  }
}
