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
import AnnotationCategory from 'src/app/models/annotationCategory.model';
import { ApiService } from '../../services/api.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { LabelType } from '../label-type';
import Annotation from 'src/app/models/annotation.model';
import { AnnotationType } from '../annotation-type';

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
  @Input() currentId: number;
  @Input() panoramaUrl: string;
  @Input() panoMode: boolean;
  @Input() resetPano = false;
  @Input() currentlyDisplayed: Array<LabelType>;
  @Input() currentlyDisplayedToggled: boolean;
  @Input() qaMode: boolean;
  @Input() annotations = new Map<AnnotationType, Array<Annotation>>();

  @Output() panoramaId = new EventEmitter();
  @Output() panoramaTouched = new EventEmitter();
  @Output() updateLabelCategory = new EventEmitter<{labelId: number, category: string, annotationType: AnnotationType}>();
  @Output() updateMissedCategory = new EventEmitter<{top: number, left: number, category: string}>();

  misreadAnnotationCategories: AnnotationCategory[];
  missedAnnotationCategories: AnnotationCategory[];
  falsePositiveAnnotationCategories: AnnotationCategory[];
  falseNegativeAnnotationCategories: AnnotationCategory[];

  // annotations
  annotationMenu: AnnotationType = AnnotationType.none;
  annotationLeft = 0;
  annotationTop = 0;
  selectedAnnotation: Annotation;
  selectedColor = '#FFD54A';
  selectedMarkerCategory = '';
  showDeleteOption = false;
  baseUrl = '';
  missingBarcodes = false; // Toggle qa user ability to add missing barcodes based on config
  misreadBarcodes = false; // Toggle qa user ability to add misread barcodes based on config
  hovered = false;

  faPlus = faPlus;
  faMinus = faMinus;

  // Pano
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

  constructor(private environment: EnvironmentService, private apiService: ApiService,
    private location: Location, private router: Router, private activatedRoute: ActivatedRoute) {
    this.missingBarcodes = environment.config.showMissingBarcodes;
    this.misreadBarcodes = environment.config.showMisreadBarcodes;
  }

  ngOnInit() {
    this.getAnnotationCategories();

    const owner = document.getElementById('image-owner');
    this.panoImageElement = document.getElementById('pano-image');
    const context = this;
    this.panZoomApi = panzoom(this.panoImageElement, {
      maxZoom: 10,
      minZoom: 0.12,
      onDoubleClick: function(e: any) {
        if (context.missingBarcodes && context.qaMode) {
          context.showDeleteOption = false;
          context.selectedMarkerCategory = '';
          context.annotationLeft = e.offsetX;
          context.annotationTop = e.offsetY;
          context.annotationMenu = AnnotationType.missed;
        }
      },
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

    // Click on annotations with touch
    this.panoImageElement.addEventListener('touchend', (e: TouchEvent) => {
      this.panoramaTouched.emit(true);
      if (e.target instanceof HTMLElement) {
        const touchedElement = e.target as HTMLElement;
        if (touchedElement.classList.contains('annotation')) {
          touchedElement.click();
        }
      }
    });
  }

  getAnnotationCategories() {
    this.apiService.getMisreadCategories().subscribe(categories => {
      this.setHotkeys(this.misreadAnnotationCategories = categories);
    });

    this.apiService.getMissedCategories().subscribe(categories => {
      this.setHotkeys(this.missedAnnotationCategories = categories);
    });

    this.apiService.getFalsePositiveCategories().subscribe(categories => {
      this.setHotkeys(this.falsePositiveAnnotationCategories = categories);
    });

    this.apiService.getFalseNegativeCategories().subscribe(categories => {
      this.setHotkeys(this.falseNegativeAnnotationCategories = categories);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.labels || changes.qaMode || changes.currentlyDisplayedToggled || changes.currentId || changes.labelsChanged)) {
      this.updateLabelBorderColors();
      if (this.qaMode) {
        this.updateAnnotationBorderColors();
      }
      this.showOrHideAnnotationOptions(undefined);
    }

    if (this.panZoomApi && (changes['panoMode'] || changes['resetPano'] !== undefined)) {
      setTimeout(() => {
        this.centerImage(this.currentWidth, this.currentHeight);
      }, 10);
    } else if (this.panZoomApi && this.currentId && this.currentId !== -1 && !this.cancelZoom) {
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
      this.labels.get(LabelType.sectionLabels)
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

  // Shortcut hotkeys to select cateogry
  setHotkeys(categories: Array<AnnotationCategory>): any {
    categories.forEach(category => {
      this.shortcuts.push(
        {
          key: category.hotkey,
          command: () => {
            this.changeAnnotation(category.categoryName);
          },
          preventDefault: true,
        },
      );
    });
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
    }
  }

  // Changes border colors for labels that have annotations attached to them
  updateAnnotationBorderColors(): any {
    this.annotations.forEach((annotations: Array<Annotation>, annotationType: AnnotationType) => {
      if (annotations) {
        annotations.forEach(annotation => {
          const categoriesList = this.categories(annotation.annotationType);
          const categoryName = annotation.annotationCategory;
          categoriesList.forEach(category => {
            if (category.categoryName === categoryName) {
              annotation.color = category.color;
            }
          });
        });
      }
    });
  }

  categories(annotationName: AnnotationType) {
    if (annotationName === AnnotationType.missed || this.annotationMenu === AnnotationType.missed) {
      return this.missedAnnotationCategories;
    } else if (annotationName === AnnotationType.misread || this.annotationMenu === AnnotationType.misread) {
      return this.misreadAnnotationCategories;
    } else if (annotationName === AnnotationType.falsePositive || this.annotationMenu === AnnotationType.falsePositive) {
      return this.falsePositiveAnnotationCategories;
    } else if (annotationName === AnnotationType.falseNegative || this.annotationMenu === AnnotationType.falseNegative) {
      return this.falseNegativeAnnotationCategories;
    }
  }

  // Determines which popup to show for annotation options
  showOrHideAnnotationOptions(annotation: Annotation): void {
    this.annotationMenu = AnnotationType.none;
    if (this.labels.size > 0 && annotation === undefined && this.qaMode) { // If label was clicked
      this.showDeleteOption = false;
      let misread: Label = null;
      if (this.misreadBarcodes) {
        misread = this.labels.get(LabelType.misreadBarcodes).find((l => l.labelId === this.currentId));
      }
      const out: Label = this.labels.get(LabelType.outs).find((l => l.labelId === this.currentId));
      const shelfLabel: Label = this.labels.get(LabelType.shelfLabels).find((l => l.labelId === this.currentId));
      let label: Label;

      if (misread) {
        this.annotationMenu = AnnotationType.misread;
        label = misread;
      } else if (out) {
        this.annotationMenu = AnnotationType.falsePositive;
        label = out;
      } else if (!out && shelfLabel) {
        this.annotationMenu = AnnotationType.falseNegative;
        label = shelfLabel;
      }
      if (label) {
        this.annotationLeft = label.bounds.left + label.bounds.width + 20; // Set bounds for annotation options pane
        this.annotationTop = label.bounds.top - label.bounds.height;
      }
    }

    if (annotation !== undefined) { // If annotation was clicked
      this.showDeleteOption = true;
      this.annotationMenu = annotation.annotationType;
      this.selectedAnnotation = annotation;
      this.annotationLeft = annotation.bounds.left + annotation.bounds.width + 20; // Set bounds for annotation options pane
      this.annotationTop = annotation.bounds.top - annotation.bounds.height;
    }
  }

  labelClicked(label: Label) {
    this.annotationMenu = AnnotationType.none;
    this.cancelZoom = true;
    if (!this.panoMode) {
      if (this.currentId !== label.labelId) {
        this.panoramaId.emit(label.labelId);
      } else {
        this.panoramaId.emit(-1);
      }
    }
  }

  getAnnotations(): Array<Annotation> {
    let labelAnnotations = [];
    if (this.qaMode) {
      if (this.misreadBarcodes) {
        labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.misread));
      }
      if (this.currentlyDisplayed.includes(LabelType.shelfLabels)) {
        labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falseNegative));
      }
      if (this.currentlyDisplayed.includes(LabelType.outs)) {
        labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falsePositive));
      }
    }
    return labelAnnotations;
  }

  annotationClicked(annotation: Annotation) {
    this.showOrHideAnnotationOptions(annotation);
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
    this.annotationMenu = AnnotationType.none;
    this.selectedMarkerCategory = '';
    this.panoramaId.emit(-1);
  }

  // When any anntation is created, updated, or deleted on the pano
  changeAnnotation(category: string) {
    this.cancelZoom = true;

    if (this.annotationMenu === AnnotationType.none) {
      return;
    } else if (this.annotationMenu === AnnotationType.missed) {
      this.updateMissedCategory.emit({
        top: this.annotationTop,
        left: this.annotationLeft,
        category: category,
      });
    } else {
      const labelId = this.selectedAnnotation ? this.selectedAnnotation.labelId : this.currentId;
      this.updateLabelCategory.emit({
        labelId: labelId,
        category: category,
        annotationType: this.annotationMenu,
      });
    }

    this.annotationMenu = AnnotationType.none;
  }

 // Css styles for annotation dropdown
  setAnnotationStyles(category: string, hovered: number, i: number, color: string) {
    const styles = {};
    styles['background-color'] = 'white';
    styles['color'] = color;
    if (this.annotationMenu === AnnotationType.missed && this.selectedMarkerCategory === category) {
      styles['background-color'] = 'lightgray'; // highlight the currently selected color light gray
    } else if (this.selectedAnnotation && this.selectedAnnotation.annotationCategory === category) {
      styles['background-color'] = 'lightgray'; // highlight the currently selected color light gray
    }
    if (hovered === i) {
      styles['color'] = 'white';
      styles['background-color'] = color;
    }
    return styles;
  }

  // Displays missing barcode markers
  setMarkerStyles(annotation: Annotation) {
    const styles = {};
    styles['top.px'] = annotation.top - 35;
    styles['left.px'] = annotation.left - 35;
    styles['border-color'] = this.missedAnnotationCategories.find((obj => obj.categoryName === annotation.annotationCategory)).color;
    return styles;
  }

  // Allow missing barcode marker to be edited when clicked on
  editMarker(index: number): void {
    this.showDeleteOption = true;
    const selected: Annotation = this.annotations.get(AnnotationType.missed)[index];
    this.annotationTop = selected.top;
    this.annotationLeft = selected.left;
    this.selectedMarkerCategory = selected.annotationCategory;
    this.annotationMenu = AnnotationType.missed;
  }
}
