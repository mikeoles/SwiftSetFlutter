import { Component, OnInit } from '@angular/core';
import { AuditStage } from './audit-stage';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Title } from '@angular/platform-browser';
import { LabelType } from 'src/app/shared/label-type';
import Label from 'src/app/models/label.model';
import Aisle from 'src/app/models/aisle.model';

@Component({
  selector: 'app-audit-aisle-view',
  templateUrl: './audit-aisle-view.component.html',
  styleUrls: ['./audit-aisle-view.component.scss']
})
export class AuditAisleViewComponent implements OnInit {

  auditStage: AuditStage = AuditStage.overview;
  aisle: Aisle;
  labels = new Map<LabelType, Array<Label>>();
  labelsChanged = false;
  panoramaUrl: string;
  currentlyDisplayed: Array<string> = new Array<string>();

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private titleService: Title) { }

  ngOnInit() {
    let missionId: string, aisleId: string, storeId: string;
    this.activatedRoute.params.forEach((params: Params) => {
      if (params['missionId'] !== undefined) {
        missionId = params['missionId'];
      }
      if (params['aisleId'] !== undefined) {
        aisleId = params['aisleId'];
      }
      if (params['storeId'] !== undefined) {
        storeId = params['storeId'];
      }
    });

    this.apiService.getAisle(storeId, missionId, aisleId).subscribe(aisle => {
      this.aisle = aisle;
      this.titleService.setTitle(aisle.aisleName + ' Audit');
      this.labels.set(LabelType.outs, aisle.outs);
      this.labels.set(LabelType.shelfLabels, aisle.labels);
      this.panoramaUrl = aisle.panoramaUrl;
      this.currentlyDisplayed.push(LabelType.shelfLabels);
      this.currentlyDisplayed.push(LabelType.outs);
      this.labelsChanged = !this.labelsChanged;
    });
  }

  completeStage() {
    if (this.auditStage === AuditStage.overview) {
      this.auditStage = AuditStage.falsePositives;
    }
  }

}
