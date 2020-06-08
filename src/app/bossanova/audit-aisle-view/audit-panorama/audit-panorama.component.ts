import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import panzoom from 'panzoom';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Label from 'src/app/models/label.model';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { LabelType } from 'src/app/shared/label-type';
import Annotation from 'src/app/models/annotation.model';
import { AnnotationType } from 'src/app/aisle-view/annotation-type';
import AnnotationCategory from 'src/app/models/annotationCategory.model';
import { AuditStage } from '../audit-stage';
import Aisle from 'src/app/models/aisle.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-audit-panorama',
  templateUrl: './audit-panorama.component.html',
  styleUrls: ['./audit-panorama.component.scss']
})
export class AuditPanoramaComponent implements OnInit, OnChanges {
  shortcuts: ShortcutInput[] = [];

  @Input() auditStage: AuditStage;
  @Input() labels = new Map<LabelType, Array<Label>>();
  @Input() panoramaUrl: string;
  @Input() currentlyDisplayed: Array<LabelType>;
  @Input() labelsChanged: boolean;
  @Input() annotations = new Map<AnnotationType, Array<Annotation>>();
  @Input() currentId: string;
  @Input() categories = new Map<AnnotationType, Array<AnnotationCategory>>();
  @Input() aisle: Aisle;

  @Output() annotationChange = new EventEmitter<number>(); // Keeps track of number of annoations for summary view

  annotationMenu: AnnotationType = AnnotationType.none;
  faPlus = faPlus;
  faMinus = faMinus;
  panZoomApi: any;
  startingZoomLevel = .3;
  showDeleteOption = false;
  annotationLeft = 0;
  annotationTop = 0;
  selectedMarkerCategory = '';
  undetectedOut = false;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    const context = this;
    this.panZoomApi = panzoom(document.getElementById('pano-image'), {
      maxZoom: 10,
      minZoom: 0.12,
      zoomDoubleClickSpeed: 1,
      onDoubleClick: function(e: any) {
        if (context.auditStage === AuditStage.undetectedLabels) {
          context.showDeleteOption = false;
          context.selectedMarkerCategory = '';
          context.annotationLeft = e.offsetX;
          context.annotationTop = e.offsetY;
          context.annotationMenu = AnnotationType.undetectedLabels;
        }
      },
    });

    this.panZoomApi.zoomAbs(0, 0, this.startingZoomLevel);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.labelsChanged || changes.auditStage) {
      this.updateLabelBorderColors();
      this.updateAnnotationBorderColors();
    }
  }

  updateLabelBorderColors(): any {
    this.currentlyDisplayed.forEach(labelType => {
      const color = this.getColorByLabelType(labelType);
      const labels = this.labels.get(labelType);
      if (labels) {
        labels.forEach(label => {
          label.color = color;
        });
      }
    });
  }

  updateAnnotationBorderColors(): any {
    if (this.annotations && this.annotations.size === 4 && this.categories && this.categories.size === 4) {
      this.annotations.forEach((annotations: Array<Annotation>) => {
        annotations.forEach(annotation => {
          const categoriesList = this.categories.get(annotation.annotationType);
          const categoryName = annotation.annotationCategory;
          categoriesList.forEach(category => {
            if (category.categoryName === categoryName) {
              annotation.color = category.color;
            }
          });
        });
      });
    }
  }

  getLabelById(labelId: string): Label {
    let matchingLabel;
    this.labels.forEach((labels: Array<Label>) => {
      labels.forEach(label => {
        if (label.labelId === labelId) {
          matchingLabel = label;
        }
      });
    });
    return matchingLabel;
  }

  getAnnotationById(labelId: string): Annotation {
    let matchingAnnotation;
    this.annotations.forEach((annotations: Array<Annotation>) => {
      annotations.forEach(annotation => {
        if (annotation.labelId === labelId) {
          matchingAnnotation = annotation;
        }
      });
    });
    return matchingAnnotation;
  }

  getColorByLabelType(labelType: LabelType): string {
    switch (labelType) {
      case LabelType.shelfLabels:
        return '#00CD87';
      case LabelType.outs:
        return '#FFFFFF';
      case LabelType.misreadBarcodes:
        return '#FF0000';
    }
  }

  getAnnotations(): Array<Annotation> {
    let labelAnnotations = [];
    if (this.annotations.has(AnnotationType.misread) &&
      (this.auditStage === AuditStage.overview || this.auditStage === AuditStage.misread)) {
      labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.misread));
    }
    if (this.annotations.has(AnnotationType.falseNegative) &&
      (this.auditStage === AuditStage.overview || this.auditStage === AuditStage.falseNegatives)) {
      labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falseNegative));
    }
    if (this.annotations.has(AnnotationType.falsePositive) &&
      (this.auditStage === AuditStage.overview || this.auditStage === AuditStage.falsePositives)) {
      labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falsePositive));
    }
    return labelAnnotations;
  }

  labelClicked(labelId: string) {
    if (this.auditStage === AuditStage.overview) {
      return;
    }
    if (this.currentId !== labelId) {
      this.currentId = labelId;
    } else {
      this.currentId = '-1';
    }
    this.showAnnotationMenu();
  }

  panoTouched() {
    this.annotationMenu = AnnotationType.none;
  }

  // Show or hide menu with a list of annotation categories
  showAnnotationMenu(): void {
    this.annotationMenu = AnnotationType.none;
    if (this.currentId === '-1') {
      return;
    }
    const annotation = this.getAnnotationById(this.currentId);
    if (annotation) {
      this.showDeleteOption = true;
      this.annotationMenu = annotation.annotationType;
    } else { // If label was clicked
      this.showDeleteOption = false;
      const out: Label = this.labels.get(LabelType.outs).find((l => l.labelId === this.currentId));
      const shelfLabel: Label = this.labels.get(LabelType.shelfLabels).find((l => l.labelId === this.currentId));
      const misread = this.labels.get(LabelType.misreadBarcodes).find((l => l.labelId === this.currentId));
      if (misread) {
        this.annotationMenu = AnnotationType.misread;
      } else if (out) {
        this.annotationMenu = AnnotationType.falsePositive;
      } else if (shelfLabel) {
        this.annotationMenu = AnnotationType.falseNegative;
      }
    }
  }

  showUndetectedLabels() {
    return this.auditStage === AuditStage.overview || this.auditStage === AuditStage.undetectedLabels;
  }

  // When a user chooses an annotation from the menu
  changeAnnotation(category: string) {
    if (this.annotationMenu === AnnotationType.none) {
      return;
    } else if (this.annotationMenu === AnnotationType.undetectedLabels) {
      this.updateUndetectedLabelsCategory({
        top: this.annotationTop,
        left: this.annotationLeft,
        category: category,
      });
    } else {
      this.updateLabelCategory({
        labelId: this.currentId,
        category: category,
        annotationType: this.annotationMenu,
      });
    }
    this.annotationMenu = AnnotationType.none;
  }

  updateLabelCategory(info: {labelId: string, category: string, annotationType: AnnotationType}): any {
    const annotationsToUpdate: Annotation[] = this.annotations.get(info.annotationType);

    const i = annotationsToUpdate.findIndex(annotation => {
      return annotation !== undefined && annotation.labelId === info.labelId;
    });
    let action = '';
    if (info.category === undefined) {
      action = 'delete';
      this.annotationChange.emit(-1);
      delete annotationsToUpdate[i];
    } else if (i > -1) {
      action = 'update';
      annotationsToUpdate[i].annotationCategory = info.category;
    } else {
      action = 'create';
      this.annotationChange.emit(1);
      annotationsToUpdate.push({
        annotationType: info.annotationType,
        annotationCategory: info.category,
        labelId: info.labelId,
        top: undefined,
        left: undefined,
        color: undefined,
        out: undefined
      });
    }
    this.annotations.set(info.annotationType, annotationsToUpdate);
    this.apiService.updateLabelAnnotation(
      this.aisle.storeId,
      this.aisle.missionId,
      this.aisle.aisleId,
      info.labelId, info.category, info.annotationType, action
    );
    this.updateAnnotationBorderColors();
  }

  updateUndetectedLabelsCategory(info: {top: number, left: number, category: string}): any {
    const undetectedLabels: Array<Annotation> = this.annotations.get(AnnotationType.undetectedLabels);
    const i = undetectedLabels.findIndex(m => {
      return m !== undefined && m.left === info.left && m.top === info.top;
    });
    let action: string;

    if (info.category === undefined) {
      action = 'delete';
      this.annotationChange.emit(-1);
      delete undetectedLabels[i];
    } else if (i > -1) {
      action = 'update';
      undetectedLabels[i].annotationCategory = info.category;
    } else {
      action = 'create';
      const annotation: Annotation = new Annotation();
      annotation.annotationType = AnnotationType.undetectedLabels;
      annotation.annotationCategory = info.category;
      annotation.top = info.top;
      annotation.left = info.left;
      this.annotationChange.emit(1);
      undetectedLabels.push(annotation);
    }

    this.apiService.updateUndetectedLabelsAnnotation(
      this.aisle.storeId, this.aisle.missionId, this.aisle.aisleId,
      String(info.top), String(info.left), info.category, String(this.undetectedOut), action
    );
  }

  // Allow undetected labels marker to be edited when clicked on
  editMarker(annotation: Annotation): void {
    if (this.auditStage === AuditStage.undetectedLabels) {
      this.currentId = '-1';
      this.showDeleteOption = true;
      const undetectedLabelsAnnotations: Annotation[] = this.annotations.get(AnnotationType.undetectedLabels);
      const selected = undetectedLabelsAnnotations.find(a => {
        return a && a.top === annotation.top && a.left === annotation.left;
      });
      this.annotationTop = selected.top;
      this.annotationLeft = selected.left;
      this.selectedMarkerCategory = selected.annotationCategory;
      this.undetectedOut = selected.out;
      this.annotationMenu = AnnotationType.undetectedLabels;
    }
  }

  // If the currently selected undetected label is supposed to be an out
  undetectedOutChanged(selected: boolean) {
    this.undetectedOut = selected;
    const undetectedLabels: Array<Annotation> = this.annotations.get(AnnotationType.undetectedLabels);
    const i = undetectedLabels.findIndex(m => {
      return m !== undefined && m.left === this.annotationLeft && m.top === this.annotationTop;
    });
    undetectedLabels[i].out = this.undetectedOut;
    this.apiService.updateUndetectedLabelsAnnotation(
      this.aisle.storeId, this.aisle.missionId, this.aisle.aisleId,
      String(undetectedLabels[i].top), String(undetectedLabels[i].left), undetectedLabels[i].annotationCategory, String(this.undetectedOut), 'update'
    );
  }

  // Css styles for annotation dropdown
  setMenuOptionStyles(category: string, hovered: number, i: number, color: string) {
    const styles = {};
    styles['background-color'] = 'white';
    styles['color'] = color;
    let annotation = null;
    if (this.currentId && this.currentId !== '-1') {
      annotation = this.getAnnotationById(this.currentId);
    }
    if (this.annotationMenu === AnnotationType.undetectedLabels && this.selectedMarkerCategory === category) {
      styles['background-color'] = 'lightgray'; // highlight the currently selected color light gray
    } else if (annotation && annotation.annotationCategory === category) {
      styles['background-color'] = 'lightgray'; // highlight the currently selected color light gray
    }
    if (hovered === i) {
      styles['color'] = 'white';
      styles['background-color'] = color;
    }
      return styles;
  }

  // Display QA Selction Options
  setMenuStyles() {
    const styles = {};
    if (this.annotationMenu === AnnotationType.none) {
      styles['display'] = 'none';
    } else {
      styles['display'] = 'block';
    }
    return styles;
  }

  // Displays undetectedLabels markers
  setMarkerStyles(annotation: Annotation) {
    if (annotation && this.categories.has(AnnotationType.undetectedLabels)) {
      const styles = {};
      styles['top.px'] = annotation.top - 35;
      styles['left.px'] = annotation.left - 35;
      styles['border-color'] = this.categories.get(AnnotationType.undetectedLabels)
        .find((obj => obj.categoryName === annotation.annotationCategory)).color;
      return styles;
    }
  }

  // Css styles for annotations
  setAnnotationStyles(labelId: string, color: string) {
    const styles = {};
    const label = this.getLabelById(labelId); // Get bounds for annotation by finding associated label
    if (label !== undefined) {
      styles['left.px'] = label.bounds.left;
      styles['top.px'] = label.bounds.top;
      styles['width.px'] = label.bounds.width;
      styles['height.px'] = label.bounds.height;
      styles['border-color'] = color;
    }
    return styles;
  }

  zoomIn() {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, 1.25);
    return false;
  }

  zoomOut() {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, 0.8);
    return false;
  }
}
