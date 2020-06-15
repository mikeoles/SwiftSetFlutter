import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import panzoom from 'panzoom';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Label from 'src/app/models/label.model';
import { EnvironmentService } from '../../services/environment.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { LabelType } from 'src/app/shared/label-type';
import Aisle from 'src/app/models/aisle.model';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import Mission from 'src/app/models/mission.model';
import { AnnotationType } from 'src/app/shared/annotation-type';
import Annotation from 'src/app/models/annotation.model';
import AnnotationCategory from 'src/app/models/annotationCategory.model';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss'],
})

export class PanoramaComponent implements OnInit, OnChanges {
  shortcuts: ShortcutInput[] = [];

  @Input() labels = new Map<LabelType, Array<Label>>();
  @Input() labelsChanged: boolean;
  @Input() sectionBreaks: number[];
  @Input() currentId: string;
  @Input() panoramaUrl: string;
  @Input() panoMode: boolean;
  @Input() resetPano = false;
  @Input() exportPano = false;
  @Input() selectedAisle: Aisle;
  @Input() selectedMission: Mission;
  @Input() currentlyDisplayed: Array<LabelType>;
  @Input() currentlyDisplayedToggled: boolean;
  @Input() showCoverageIssueDetails: boolean;
  @Input() annotations = new Map<AnnotationType, Array<Annotation>>();
  @Input() categories = new Map<AnnotationType, Array<AnnotationCategory>>();

  @Output() panoramaId = new EventEmitter<string>();
  @Output() panoramaTouched = new EventEmitter();
  @Output() toggleCoverageIssueDetails = new EventEmitter();

  misreadBarcodes = false; // Toggle qa user ability to add misread barcodes based on config
  faPlus = faPlus;
  faMinus = faMinus;
  panZoomApi: any;
  startingZoomLevel = .13;
  panoModeStartingZoomLevel  = .25;
  labelZoomLevel = .5;
  panoHeight = 365;
  currentWidth = 0;
  currentHeight = 0;
  cancelZoom = false;
  panoImageElement: HTMLElement = document.getElementById('pano-image');
  labelType = LabelType;
  selectedColor = '#FFD54A';
  baseUrl = '';

  constructor(environment: EnvironmentService, private location: Location, private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.misreadBarcodes = environment.config.showMisreadBarcodes;
  }

  ngOnInit() {
    const owner = document.getElementById('image-owner');
    this.panoImageElement = document.getElementById('pano-image');
    const context = this;
    this.panZoomApi = panzoom(this.panoImageElement, {
      maxZoom: 10,
      minZoom: 0.12,
      zoomDoubleClickSpeed: 1,
    });

    // Set position based off url
    this.baseUrl = this.router.url;
    const params = this.activatedRoute.snapshot.queryParams;
    if (params['zoom'] && params['x'] && params['y']) {
      this.panZoomApi.zoomAbs(0, 0, 1);
      this.panZoomApi.moveTo(params.x * (1 / params.zoom), params.y * (1 / params.zoom));
      this.panZoomApi.zoomAbs(0, 0, params.zoom);
      this.baseUrl = this.baseUrl.substr(0, this.baseUrl.indexOf('?zoom'));
    } else { // center image if not url params
      const interval = setInterval(() => {
        if (this.panoImageElement.offsetWidth !== 0 && this.panoImageElement.offsetWidth !== this.currentWidth) {
          this.centerImage(this.panoImageElement.offsetWidth, this.panoImageElement.offsetHeight);
          this.currentWidth = this.panoImageElement.offsetWidth;
          this.currentHeight = this.panoImageElement.offsetHeight;
          clearInterval(interval);
        }
      }, 5);
    }

     // And update on changes
    this.panZoomApi.on('transform', function(e) {
      const p = context.panZoomApi.getTransform();
      context.location.go(
        context.baseUrl +
        '?zoom=' + parseFloat(p.scale).toFixed(2) +
        '&x=' + parseFloat(p.x).toFixed(2) + '&y=' +
        parseFloat(p.y).toFixed(2)
      );
    });

    // Check if image is moved off screen and center it
    owner.addEventListener('touchend', (e: TouchEvent) => {
      if (
        (this.panZoomApi.getTransform().x > window.screen.width) ||
        (this.panZoomApi.getTransform().x * -1 > this.currentWidth * this.panZoomApi.getTransform().scale) ||
        (this.panZoomApi.getTransform().y > this.panoHeight) ||
        (this.panZoomApi.getTransform().y * -1 > this.currentHeight * this.panZoomApi.getTransform().scale)
      ) {
        this.centerImage(this.currentWidth, this.currentHeight);
      }
    });

    // Click on label with touch
    this.panoImageElement.addEventListener('touchend', (e: TouchEvent) => {
      this.panoramaTouched.emit(true);
      if (e.target instanceof HTMLElement) {
        const touchedElement = e.target as HTMLElement;
        if (touchedElement.classList.contains('label')) {
          touchedElement.click();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.exportPano && this.exportPano) {
      const context = this;
      this.panZoomApi = panzoom(this.panoImageElement, {
        maxZoom: 1,
        minZoom: 1
      });
      setTimeout(() => {
        htmlToImage.toJpeg(document.getElementById('pano-image'))
        .then(function (blob) {
          saveAs(blob,
            context.selectedMission.storeName + ' ' +
            context.selectedMission.missionName + ' ' +
            context.selectedAisle.aisleName + '.jpg');
          context.ngOnInit();
        });
      },
      1000);
    }

    if (changes.labels || changes.currentlyDisplayedToggled || changes.currentId || changes.labelsChanged) {
      this.updateLabelBorderColors();
      this.updateAnnotationBorderColors();
    }

    if (this.panZoomApi && (changes['panoMode'] || changes['resetPano'] !== undefined)) {
      setTimeout(() => {
        this.centerImage(this.currentWidth, this.currentHeight);
      }, 10);
    } else if (this.panZoomApi && this.currentId && this.currentId !== '-1' && !this.cancelZoom) {
      this.zoomToLabel();
    }
    this.cancelZoom = false;
  }

  // Center the pano on the screen
  centerImage(imageWidth: number, imageHeight: number) {
    let moveX = 0;
    let moveY = 0;
    let zoom = this.startingZoomLevel;
    if (this.panoMode) {
      zoom = this.panoModeStartingZoomLevel;
      // Center vertically in pano mode
      if (imageHeight * zoom < window.innerHeight) {
        const top = document.getElementById('missionsContainer');
        const bottom = document.getElementById('tableSelection');
        const paneHeight = window.innerHeight - top.offsetHeight - bottom.offsetHeight;
        moveY = (imageHeight / 2) - (paneHeight / 2) * (1 / zoom);
      }
    }
    // If image is smaller than screen, center image
    if (imageWidth * zoom < window.innerWidth) {
      moveX = (imageWidth / 2) - (window.innerWidth / 2) * (1 / zoom);
    }
    this.panZoomApi.zoomAbs(0, 0, 1);
    this.panZoomApi.moveTo(moveX * -1, moveY * -1);
    this.panZoomApi.zoomAbs(0, 0, zoom);
  }

  // Zoom in on selected label
  zoomToLabel(): any {
    const allLabels: Array<Label> = [].concat(
      this.labels.get(LabelType.shelfLabels),
      this.labels.get(LabelType.outs),
      this.labels.get(LabelType.topStock),
      this.labels.get(LabelType.sectionLabels),
      this.labels.get(LabelType.previouslySeenBarcodes)
    );

    const selectedLabel: Label = allLabels[allLabels.findIndex((label => label.labelId === this.currentId))];
    const selectedX =
      selectedLabel.bounds.left +
      selectedLabel.bounds.width / 2 -
      (window.screen.width / 2) * (1 / this.labelZoomLevel);
    const selectedY =
      selectedLabel.bounds.top +
      selectedLabel.bounds.height / 2 -
      (this.panoHeight / 2) * (1 / this.labelZoomLevel);

    this.panZoomApi.zoomAbs(0, 0, 1);
    this.panZoomApi.moveTo(selectedX * -1, selectedY * -1);
    this.panZoomApi.zoomAbs(0, 0, this.labelZoomLevel);
  }

  // Sets border colors labels
  updateLabelBorderColors(): any {
    this.currentlyDisplayed.forEach(labelType => {
      const color = this.getColorByLabelType(labelType);
      const labels = this.labels.get(labelType);
      if (labels) {
        labels.forEach(label => {
          label.color = label.labelId === this.currentId ? this.selectedColor : color; // highlight label if selected by user
        });
      }
    });
  }

  getColorByLabelType(labelType: LabelType): string {
    switch (labelType) {
      case LabelType.shelfLabels:
        return '#00CD87';
      case LabelType.outs:
        return '#FFFFFF';
      case LabelType.misreadBarcodes:
        return '#FF0000';
      case LabelType.sectionLabels:
        return '#800080';
      case LabelType.topStock:
        return '#FFC0CB';
      case LabelType.previouslySeenBarcodes:
        return '#17c9ff';
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

  labelClicked(label: Label) {
    this.cancelZoom = true;
    if (!this.panoMode) {
      if (this.currentId !== label.labelId) {
        this.panoramaId.emit(label.labelId);
      } else {
        this.panoramaId.emit('-1');
      }
    }
  }

  zoomIn() {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, 1.25);
    return false;
  }

  zoomOut() {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, 0.8);
    return false;
  }

  panoTouched() {
    this.panoramaId.emit('-1');
  }

  closeCoverageIssueDetails() {
    this.toggleCoverageIssueDetails.emit();
  }

  setAnnotationStyles(labelId: string, color: string) {
    const styles = {};
    const label = this.getLabelById(labelId);
    if (label !== undefined) {
      styles['left.px'] = label.bounds.left;
      styles['top.px'] = label.bounds.top;
      styles['width.px'] = label.bounds.width;
      styles['height.px'] = label.bounds.height;
      styles['border-color'] = color;
    }
    return styles;
  }

  getAnnotations(): Array<Annotation> {
    let labelAnnotations = [];
    if (this.currentlyDisplayed.includes(LabelType.falseNegatives) && this.annotations.has(AnnotationType.falseNegative)) {
      labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falseNegative));
    }
    if (this.currentlyDisplayed.includes(LabelType.falsePositives)  && this.annotations.has(AnnotationType.falsePositive)) {
      labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falsePositive));
    }
    return labelAnnotations;
  }

  // Changes border colors for labels that have annotations attached to them
  updateAnnotationBorderColors(): any {
    if (this.annotations && this.annotations.size > 0 && this.categories && this.categories.size > 0) {
      this.annotations.forEach((annotations: Array<Annotation>, annotationType: AnnotationType) => {
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
}
