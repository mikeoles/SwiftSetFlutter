import { Component, OnInit } from '@angular/core';
import { AuditStage } from './audit-stage';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Title } from '@angular/platform-browser';
import { LabelType } from 'src/app/shared/label-type';
import Label from 'src/app/models/label.model';
import Aisle from 'src/app/models/aisle.model';
import { AnnotationType } from 'src/app/aisle-view/annotation-type';
import Annotation from 'src/app/models/annotation.model';
import AnnotationCategory from 'src/app/models/annotationCategory.model';

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
  annotations = new Map<AnnotationType, Array<Annotation>>();
  categories = new Map<AnnotationType, Array<AnnotationCategory>>();

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private titleService: Title,
    private router: Router) { }

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

      this.apiService.getAnnotations(storeId, missionId, aisleId).subscribe(annotations => {
        this.aisle.falseNegativeCount += annotations.falseNegatives.length;
        this.aisle.falsePositiveCount += annotations.falsePositives.length;
        this.setLabelAnnotations(annotations.falsePositives, AnnotationType.falsePositive);
        this.setLabelAnnotations(annotations.falseNegatives, AnnotationType.falseNegative);
        this.labelsChanged = !this.labelsChanged;
      });

      this.apiService.getFalsePositiveCategories().subscribe(categories => {
        this.categories.set(AnnotationType.falsePositive, categories);
        this.labelsChanged = !this.labelsChanged;
      });
      this.apiService.getFalseNegativeCategories().subscribe(categories => {
        this.categories.set(AnnotationType.falseNegative, categories);
        this.labelsChanged = !this.labelsChanged;
      });
    });
  }

  completeStage() {
    if (this.auditStage === AuditStage.overview) {
      this.auditStage = AuditStage.falsePositives;
      this.currentlyDisplayed = [];
      this.currentlyDisplayed.push(LabelType.outs);
    } else if (this.auditStage === AuditStage.falsePositives) {
      this.auditStage = AuditStage.falseNegatives;
      this.currentlyDisplayed = [];
      this.currentlyDisplayed.push(LabelType.shelfLabels);
    } else if (this.auditStage === AuditStage.falseNegatives) {
      this.finalizeAudit();
    }
  }

  finalizeAudit() {
    this.apiService.finalizeAudit(this.aisle);
    this.router.navigate(['store/' + this.aisle.storeId + '/mission/' + this.aisle.missionId]);
  }

  setLabelAnnotations(annotations, annotationType: AnnotationType): any {
    if (annotations === undefined) {
      annotations = [];
    }
    const annotationsList: Array<Annotation> = [];
    annotations.forEach(annotation => {
      const annotationObj = new Annotation();
      annotationObj.annotationType = annotationType;
      annotationObj.annotationCategory = annotation.category;
      annotationObj.labelId = annotation.labelId;
      annotationsList.push(annotationObj);
    });
    this.annotations.set(annotationType, annotationsList);
  }

  updateAnnotationCounts(change: number) {
    if (this.auditStage === AuditStage.falseNegatives) {
      this.aisle.falseNegativeCount += change;
    } else if (this.auditStage === AuditStage.falsePositives) {
      this.aisle.falsePositiveCount += change;
    }
  }

}
