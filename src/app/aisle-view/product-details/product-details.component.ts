import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import Label from '../../models/label.model';
import Annotation from 'src/app/models/annotation.model';
import { EnvironmentService } from '../../services/environment.service';
import { ApiService } from 'src/app/services/api.service';
import { LabelType } from '../label-type';
import { AnnotationType } from '../annotation-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})

export class ProductDetailsComponent implements OnChanges {

  @Input() labelsDictionary = new Map<LabelType, Array<Label>>();
  @Input() annotationsDictionary = new Map<AnnotationType, Array<Annotation>>();
  @Input() sectionBreaks: number[] = [];
  @Input() labelsChanged: boolean;
  @Input() currentlyDisplayed: Array<string>;
  @Input() currentId: number;
  @Input() panoMode: boolean;
  @Input() qaMode: boolean;
  @Input() coverageDelta: number;

  @Output() gridId = new EventEmitter();

  allLabels: Array<Label> = [];
  allAnnotations: Array<Annotation> = [];

  showSectionLabels = false;
  showSectionBreaks = false;
  showTopStock = false;
  showMisreadBarcodes = false;
  labelType = LabelType;

  constructor(private environment: EnvironmentService, private apiService: ApiService) {
    this.showMisreadBarcodes = environment.config.showMisreadBarcodes;
    this.showSectionLabels = environment.config.showSectionLabels;
    this.showTopStock = environment.config.showTopStock;
    this.showSectionBreaks = environment.config.showSectionBreaks;
  }

  ngOnChanges(): void {
    this.allLabels = [];
    this.allAnnotations = [];
    this.labelsDictionary.forEach((labels: Label[], type: LabelType) => {
      if (this.currentlyDisplayed.includes(type)) { // only display labels selected in the selection area dropdown
        this.allLabels = this.allLabels.concat(labels);
      }
    });
    this.annotationsDictionary.forEach((annotations: Annotation[]) => {
      this.allAnnotations = this.allAnnotations.concat(annotations);
    });
  }

  // if an item is clied on the grid
  productGridSelected(id) {
    if (id === this.currentId) {
      this.gridId.emit(-1);
    } else {
      this.gridId.emit(id);
    }
  }

  getCount(labelType: LabelType): number {
    if (this.labelsDictionary.has(labelType)) {
      return this.labelsDictionary.get(labelType).length;
    }
    return 0;
  }
}
