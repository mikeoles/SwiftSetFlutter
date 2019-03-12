import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { IApiService } from '../api.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Aisle from '../aisle.model';
import Mission from '../mission.model';
import Label from '../label.model';
import Store from '../store.model';
import { ModalService } from '../modal/modal.service';
import { BackService } from '../back.service';
import { Subscription } from 'rxjs';
import { EnvironmentService } from '../environment.service';
import { DataService } from '../data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss'],
  providers: [
    {
      provide: 'IApiService',
      useClass: environment.apiService
    }
  ]
})

export class MissionViewComponent implements OnInit, OnDestroy {
  missionSummary: MissionSummary;
  mission: Mission;
  store: Store;
  averageLabels: number;
  aisles: Aisle[];
  averageStoreOuts: number;
  averageStoreLabels: number;
  service: IApiService;

  private backButtonSubscription: Subscription;

  constructor(@Inject('IApiService') private apiService: IApiService, private activatedRoute: ActivatedRoute, private router: Router,
    private modalService: ModalService, private backService: BackService, private environment: EnvironmentService,
    public dataService: DataService) {

  }

  ngOnInit() {
    this.backButtonSubscription = this.backService.backClickEvent().subscribe(() => this.goBack());
    let missionId: number, storeId: number;
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        missionId = Number(params['missionId']);
        storeId = Number(params['storeId']);
      }
    });
    this.apiService.getMission(storeId, missionId).subscribe(mission => {
      this.mission = mission;
      this.apiService.getMissionSummary(mission.storeId, this.mission.missionId).subscribe(missionSummary => {
        this.missionSummary = missionSummary;
        this.apiService.getAisles(mission.storeId, this.mission.missionId).subscribe(aisles => {
          this.aisles = aisles;
          for (let i = 0; i < this.aisles.length; i++) {
            this.apiService.getAisle(mission.storeId, this.mission.missionId, this.aisles[i].aisleId).subscribe(aisle => {
              this.aisles[i] = aisle;
            });
          }
        });
        const twoWeeksAgo: Date = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);
        this.apiService.getStore(mission.storeId, twoWeeksAgo, Intl.DateTimeFormat().resolvedOptions().timeZone).subscribe(store => {
          this.store = store;

          // If this page was nagivates to from the store view, show the two week average from there, if not show the last two weeks average
          this.averageStoreLabels = this.dataService.averageStoreLabels
            ? this.dataService.averageStoreLabels : this.store.totalAverageLabels;
          this.averageStoreOuts = this.dataService.averageStoreOuts
            ? this.dataService.averageStoreOuts : this.store.totalAverageOuts;
        });
      });
    });
    this.service = this.apiService;
}

  goBack(): void {
    this.router.navigate(['store/' + this.store.storeId]);
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

  exportMission(exportType: string, modalId: string) {
    const exportFields: string[] = this.environment.config.exportFields;
    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF';
    csvContent += encodeURIComponent(exportFields.join(',')) + '\n';

    for (let i = 0; i < this.aisles.length; i++) {
      const aisle = this.aisles[i];
      const outs: Label[] = aisle.outs;
      const labels: Label[]  = aisle.labels;
      const exportData: Label[] = exportType === 'labels' ? labels : outs;
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
        csvContent += encodeURIComponent(row.join(',')) + '\n';
      }
      this.modalService.close(modalId);
    }

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'Mission-' + this.mission.missionName + '-' + exportType + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
