import { Component, OnInit } from '@angular/core';
import { AuditStage } from './audit-stage';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Title } from '@angular/platform-browser';
import { LabelType } from 'src/app/shared/label-type';
import Label from 'src/app/models/label.model';
import Aisle from 'src/app/models/aisle.model';
import { AnnotationType } from 'src/app/bossanova/audit-aisle-view/annotation-type';
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
  misreadCount = 0;
  undetectedLabelsCount = 0;
  barcode = '';

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
      const misreadBarcodes: Array<Label> = this.getMisreadBarcodes(aisle.labels);
      misreadBarcodes.concat(this.getMisreadBarcodes(aisle.outs));
      this.labels.set(LabelType.misreadBarcodes, misreadBarcodes);
      this.labels.set(LabelType.outs, aisle.outs);
      this.labels.set(LabelType.shelfLabels, aisle.labels);
      this.panoramaUrl = aisle.panoramaUrl;
      this.currentlyDisplayed.push(LabelType.shelfLabels);
      this.currentlyDisplayed.push(LabelType.outs);
      this.currentlyDisplayed.push(LabelType.misreadBarcodes);
      this.labelsChanged = !this.labelsChanged;

      this.apiService.getAnnotations(storeId, missionId, aisleId).subscribe(annotations => {
        this.setAnnotationCounts(annotations);
        this.setLabelAnnotations(annotations.falsePositives, AnnotationType.falsePositive);
        this.setLabelAnnotations(annotations.falseNegatives, AnnotationType.falseNegative);
        this.setLabelAnnotations(annotations.misread, AnnotationType.misread);
        this.setUndetectedLabelsAnnotations(annotations.undetectedLabels);
        this.labelsChanged = !this.labelsChanged;
      });
      this.apiService.getMisreadCategories().subscribe(categories => {
        this.categories.set(AnnotationType.misread, categories);
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
      this.apiService.getUndetectedLabelsCategories().subscribe(categories => {
        this.categories.set(AnnotationType.undetectedLabels, categories);
        this.labelsChanged = !this.labelsChanged;
      });
    });
  }

  setAnnotationCounts(annotations: any) {
    if (annotations.falseNegatives) {
      this.aisle.falseNegativeCount += annotations.falseNegatives.length;
    }
    if (annotations.falsePositives) {
      this.aisle.falsePositiveCount += annotations.falsePositives.length;
    }
    if (annotations.misread) {
      this.misreadCount += annotations.misread.length;
    }
    if (annotations.undetectedLabels) {
      this.undetectedLabelsCount += annotations.undetectedLabels.length;
    }
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
      this.auditStage = AuditStage.misread;
      this.currentlyDisplayed = [];
      this.currentlyDisplayed.push(LabelType.misreadBarcodes);
    } else if (this.auditStage === AuditStage.misread) {
      this.auditStage = AuditStage.undetectedLabels;
      this.currentlyDisplayed = [];
      this.currentlyDisplayed.push(LabelType.shelfLabels);
      this.currentlyDisplayed.push(LabelType.outs);
    } else if (this.auditStage === AuditStage.undetectedLabels) {
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

  setUndetectedLabelsAnnotations(annotations): any {
    if (annotations === undefined) {
      annotations = [];
    }
    const annotationsList: Array<Annotation> = [];
    annotations.forEach(annotation => {
      const annotationObj = new Annotation();
      annotationObj.annotationType = AnnotationType.undetectedLabels;
      annotationObj.annotationCategory = annotation.category;
      annotationObj.top = annotation.top;
      annotationObj.left = annotation.left;
      annotationsList.push(annotationObj);
    });
    this.annotations.set(AnnotationType.undetectedLabels, annotationsList);
  }

  updateAnnotationCounts(change: number) {
    if (this.auditStage === AuditStage.falseNegatives) {
      this.aisle.falseNegativeCount += change;
    } else if (this.auditStage === AuditStage.falsePositives) {
      this.aisle.falsePositiveCount += change;
    } else if (this.auditStage === AuditStage.misread) {
      this.misreadCount += change;
    } else if (this.auditStage === AuditStage.undetectedLabels) {
      this.undetectedLabelsCount += change;
    }
  }

  // Barcodes with all zeroes are considered misread barcodes
  getMisreadBarcodes(labels: Array<Label>): Array<Label> {
    const misreadBarcodes: Array<Label> = [];
    labels.forEach(label => {
      if (/^0*$/.test(label.barcode)) {
        misreadBarcodes.push(label);
      }
    });
    return misreadBarcodes;
  }
}
