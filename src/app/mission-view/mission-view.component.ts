import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import Aisle from '../aisle.model';
import Mission from '../mission.model';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss']
})

export class MissionViewComponent implements OnInit {
  missionSummary: MissionSummary;
  mission: Mission;
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
      this.apiService.getMissionSummary(this.mission.name).subscribe(missionSummary => {
        this.missionSummary = missionSummary;
        this.apiService.getAisles(this.currentMission).subscribe(aisles => {
          this.aisles = aisles;
          for (let i = 0; i < this.aisles.length; i++) {
            this.apiService.getAisle(this.aisles[i].id).subscribe(aisle => {
              this.aisles[i] = aisle;
            });
          }
        });
      });
    });
    this.service = this.apiService;
  }

  exportMission() {
    const headers = ['Aisle name',
      'Barcode',
      'Product Info',
      'Out Of Stock',
      'Location'];
    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF';
    let labels, outs;
    csvContent += headers.join(',') + '\n';
    for (let i = 0; i < this.aisles.length; i++) {
      const aisle = this.aisles[i];
      this.apiService.getLabels(aisle.id).subscribe(l => labels = l);
      this.apiService.getOuts(aisle.id).subscribe(o => outs = o);
      const outsBarcodes: Set<string> = new Set<string>();
      for (let j = 0; j < outs.length; j++) {
        outsBarcodes.add(outs[j].Barcode);
      }
      for (let j = 0; j < labels.length; j++) {
        const inStock: Boolean = !outsBarcodes.has(labels[j].Barcode);
        const row = [aisle.id,
          '\'' + labels[j].Barcode ,
          'Info' ,
          inStock.toString(),
          'X: ' + labels[j].X1 + ' Y: ' + labels[j].Z1].join(',');
        csvContent += row + '\n';
      }
    }


    // do the download stuff
    const encodedUri = csvContent;
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Mission-' + this.currentMission + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
