import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Aisle from '../aisle.model';
import Mission from '../mission.model';
import Label from '../label.model';
import Store from '../store.model';
import { environment } from 'src/environments/environment.prod';

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

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute) {

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
            this.apiService.getAisle(this.aisles[i].id).subscribe(aisle => {
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

  exportMission() {
    const showAllLabels = false;
    const headers = ['Aisle Name',
      'Barcode',
      'Location'];
    if (showAllLabels) {
      headers.concat('Out Of Stock');
    }
    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF';
    csvContent += headers.join(',') + '\n';
    for (let i = 0; i < this.aisles.length; i++) {
      const aisle = this.aisles[i];
      const outs: Label[] = aisle.outs;
      const labels: Label[]  = aisle.labels;
      const outsBarcodes: Set<string> = new Set<string>();
      for (let j = 0; j < outs.length; j++) {
        outsBarcodes.add(outs[j].barcode);
      }
      for (let j = 0; j < labels.length; j++) {
        const row = [
          aisle.id,
          '\'' + labels[j].barcode ,
          'X: ' + labels[j].bounds.left + ' Y: ' + labels[j].bounds.top,
        ].join(',');

        const outOfStock: Boolean = outsBarcodes.has(labels[j].barcode);

        if (showAllLabels) {
          row.concat(',' + outOfStock.toString());
        }

        if (showAllLabels || outOfStock) {
          csvContent += row + '\n';
        }
      }
    }

    // do the download stuff
    const encodedUri = csvContent;
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Mission-' + this.mission.name + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
