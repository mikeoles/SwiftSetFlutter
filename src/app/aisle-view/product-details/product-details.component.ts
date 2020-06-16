import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import Label from '../../models/label.model';
import { EnvironmentService } from '../../services/environment.service';
import { ApiService } from 'src/app/services/api.service';
import { LabelType } from 'src/app/shared/label-type';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Aisle from 'src/app/models/aisle.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})

export class ProductDetailsComponent implements OnChanges {

  @Input() labelsDictionary = new Map<LabelType, Array<Label>>();
  @Input() sectionBreaks: number[] = [];
  @Input() labelsChanged: boolean;
  @Input() currentlyDisplayed: Array<string>;
  @Input() currentId: number;
  @Input() panoMode: boolean;
  @Input() selectedAisle: Aisle;

  @Output() gridId = new EventEmitter();
  @Output() toggleCoverageIssueDetails = new EventEmitter();


  allLabels: Array<Label> = [];

  showSectionLabels = false;
  showSectionBreaks = false;
  showTopStock = false;
  showMisreadBarcodes = false;
  showCoverageIssueDetails = false;
  labelType = LabelType;
  faExclamationTriangle = faExclamationTriangle;

  constructor(private environment: EnvironmentService, private apiService: ApiService) {
    this.showMisreadBarcodes = environment.config.showMisreadBarcodes;
    this.showSectionLabels = environment.config.showSectionLabels;
    this.showTopStock = environment.config.showTopStock;
    this.showSectionBreaks = environment.config.showSectionBreaks;
  }

  ngOnChanges(): void {
    this.allLabels = [];
    this.labelsDictionary.forEach((labels: Label[], type: LabelType) => {
      if (this.currentlyDisplayed.includes(type)) { // only display labels selected in the selection area dropdown
        this.allLabels = this.allLabels.concat(labels);
      }
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

  // Only display the warning symbol
  hasProblems() {
    return this.selectedAisle &&
    this.selectedAisle.missingPreviouslySeenBarcodePercentage > this.environment.config.missingPreviosulySeenThreshold;
  }

  coverageIssueClicked() {
    this.toggleCoverageIssueDetails.emit();
  }
}
