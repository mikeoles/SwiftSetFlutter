import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Aisle from '../aisle.model';
import Mission from '../mission.model';
import Label from '../label.model';
import Store from '../store.model';
import { ModalService } from '../modal/modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss']
})

export class MissionViewComponent implements OnInit {
  missionSummary: MissionSummary;
  mission: Mission;
  store: Store;
  averageLabels: number;
  averageOuts: number;
  averageSpreads: number;
  aisles: Aisle[];
  currentMission: number;
  service: ApiService;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private modalService: ModalService) {

  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        this.currentMission = params['missionId'];
      }
    });
    this.apiService.getMission(this.currentMission).subscribe(mission => {
      this.mission = mission;
      this.apiService.getMissionSummary(this.currentMission).subscribe(missionSummary => {
        this.missionSummary = missionSummary;
        this.apiService.getAisles(this.currentMission).subscribe(aisles => {
          this.aisles = aisles;
          for (let i = 0; i < this.aisles.length; i++) {
            this.apiService.getAisle(this.aisles[i].aisleId).subscribe(aisle => {
              this.aisles[i] = aisle;
            });
          }
        });
        this.apiService.getStore(mission.storeId).subscribe(store => {
          this.store = store;
          this.averageLabels = Math.max(store.totalAverageLabels, this.missionSummary.labels);
          this.averageOuts = Math.max(store.totalAverageOuts, this.missionSummary.outs);
          this.averageSpreads = Math.max(store.totalAverageSpreads, this.missionSummary.spreads);
        });
      });
    });
    this.service = this.apiService;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  exportMission(exportType: string, modalId: string) {
    const exportFields: string[] = environment.exportFields;
    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF';
    csvContent += exportFields.join(',') + '\n';

    for (let i = 0; i < this.aisles.length; i++) {
      const aisle = this.aisles[i];
      const outs: Label[] = aisle.outs;
      const labels: Label[]  = aisle.labels;
      const exportData: Label[] = exportType === 'labels' ? labels : outs;
      for (let j = 0; j < exportData.length; j++) {
        const label: Label = exportData[j];
        let row = [];
        for (let k = 0; k < exportFields.length; k++) {
          const field: string = exportFields[k].replace(/\s/g, '');
          const fieldLowercase = field.charAt(0).toLowerCase() + field.slice(1);
          if (label[fieldLowercase]) {
            row = row.concat(label[fieldLowercase]);
          } else if (aisle[fieldLowercase]) {
            row = row.concat(aisle[fieldLowercase]);
          } else if (this.mission[fieldLowercase]) {
            row = row.concat(this.mission[fieldLowercase]);
          } else {
            row = row.concat(label.customFields[field]);
          }
        }
        csvContent += row.join(',') + '\n';
        row = [];
      }
      this.modalService.close(modalId);
    }

    // do the download stuff
    const encodedUri = csvContent;
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Mission-' + this.mission.missionName + '-' + exportType + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
