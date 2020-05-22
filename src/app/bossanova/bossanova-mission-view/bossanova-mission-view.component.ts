import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import Mission from '../../models/mission.model';
import Label from '../../models/label.model';
import Store from '../../models/store.model';
import { ModalService } from '../../services/modal.service';
import { BackService } from '../../services/back.service';
import { Subscription } from 'rxjs';
import { EnvironmentService } from '../../services/environment.service';
import { DataService } from '../../services/data.service';
import * as jsPDF from 'jspdf';
import Aisle from '../../models/aisle.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-bossanova-mission-view',
  templateUrl: './bossanova-mission-view.component.html',
  styleUrls: ['./bossanova-mission-view.component.scss'],
})

export class BossanovaMissionViewComponent implements OnInit, OnDestroy {
  store: Store;
  mission: Mission;
  aisles: Aisle[];
  averageLabels: number;
  averageStoreOuts: number;
  averageStoreLabels: number;
  searchTerm: string;
  searchMissingBarcodes = false;
  service: ApiService;
  currentlyExporting = false;
  showExportButtons = false;

  private backButtonSubscription: Subscription;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router,
    private modalService: ModalService, private backService: BackService, private environment: EnvironmentService,
    public dataService: DataService, private titleService: Title) {
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
      this.titleService.setTitle(mission.storeName + ' - ' + mission.missionName);
      this.mission = mission;
      this.aisles = mission.aisles;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - this.environment.config.missionHistoryDays + 1);
      this.apiService.getStore(mission.storeId, startDate, new Date()).subscribe(store => {
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

  searchBarcodeClicked() {
    this.searchMissingBarcodes = false;
    if (this.searchTerm && this.searchTerm.length > 0) {
      this.apiService.getAislesByLabels(this.store.storeId, this.mission.missionId, 'barcode', this.searchTerm).subscribe(aisles => {
        this.aisles = aisles;
      });
    } else {
      this.aisles = this.mission.aisles;
    }
  }

  searchMissingBarcodesChanged(selected: boolean) {
    this.searchMissingBarcodes = selected;
    if (this.searchMissingBarcodes) {
      this.apiService.getAislesMissingBarcode(this.store.storeId, this.mission.missionId).subscribe(aisles => {
        this.aisles = aisles;
      });
    } else {
      this.aisles = this.mission.aisles;
    }
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
    if (i === this.aisles.length) {
      if (fileType === 'pdf') {
        this.exportPDF(body);
      } else {
        this.exportCSV(exportType, body, exportFields);
      }
      this.modalService.close(modalId);
    } else {
      this.apiService.getAisle(this.mission.storeId, this.mission.missionId, this.aisles[i].aisleId).subscribe(aisle => {
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
