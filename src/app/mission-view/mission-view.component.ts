import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss']
})
export class MissionViewComponent implements OnInit {
  mission: any;
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
    this.apiService.getMission(this.currentMission).subscribe(mission => this.mission = mission);
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
    for (let i = 0; i < this.mission.Aisles.length; i++) {
      const aisle = this.mission.Aisles[i];
      this.apiService.getLabels(aisle.AisleId).subscribe(l => labels = l);
      this.apiService.getOuts(aisle.AisleId).subscribe(o => outs = o);
      const outsBarcodes: Set<string> = new Set<string>();
      for (let j = 0; j < outs.length; j++) {
        outsBarcodes.add(outs[j].Barcode);
      }
      for (let j = 0; j < labels.length; j++) {
        const inStock: Boolean = !outsBarcodes.has(labels[j].Barcode);
        const row = [aisle.AisleId,
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
