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
  @Input() currentId: string;
  @Input() panoramaUrl: string;
  @Input() panoMode: boolean;
  @Input() resetPano = false;
  @Input() currentlyDisplayed: Array<LabelType>;
  @Input() currentlyDisplayedToggled: boolean;
  @Input() qaMode: boolean;
  @Input() annotations = new Map<AnnotationType, Array<Annotation>>();
  @Input() categories = new Map<AnnotationType, Array<AnnotationCategory>>();

  @Output() panoramaId = new EventEmitter<string>();
  @Output() panoramaTouched = new EventEmitter();
  @Output() updateLabelCategory = new EventEmitter<{labelId: string, category: string, annotationType: AnnotationType}>();
  @Output() updateMissedCategory = new EventEmitter<{top: number, left: number, category: string}>();

  // annotations
  annotationMenu: AnnotationType = AnnotationType.none;
  annotationLeft = 0;
  annotationTop = 0;
  selectedColor = '#FFD54A';
  selectedMarkerCategory = '';
  showDeleteOption = false;
  baseUrl = '';
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
    this.misreadBarcodes = environment.config.showMisreadBarcodes;
  }

  ngOnInit() {
    const owner = document.getElementById('image-owner');
    this.panoImageElement = document.getElementById('pano-image');
    const context = this;
    this.panZoomApi = panzoom(this.panoImageElement, {
      maxZoom: 10,
      minZoom: 0.12,
      onDoubleClick: function(e: any) {
        if (context.qaMode) {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.labels || changes.qaMode || changes.currentlyDisplayedToggled || changes.currentId || changes.labelsChanged) {
      this.updateLabelBorderColors();
      if (this.qaMode) {
        this.updateAnnotationBorderColors();
        this.setHotkeys();
      }
      this.showOrHideAnnotationOptions();
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

  // Determines which popup to show for annotation options
  showOrHideAnnotationOptions(): void {
    this.annotationMenu = AnnotationType.none;
    if (!this.qaMode || this.currentId === '-1') {
      return;
    }
    const annotation = this.getAnnotationById(this.currentId);
    if (annotation) {
      this.showDeleteOption = true;
      this.annotationMenu = annotation.annotationType;
      this.currentId = annotation.labelId;
    } else { // If label was clicked
      this.showDeleteOption = false;
      let misread: Label = null;
      if (this.misreadBarcodes) {
        misread = this.labels.get(LabelType.misreadBarcodes).find((l => l.labelId === this.currentId));
      }
      const out: Label = this.labels.get(LabelType.outs).find((l => l.labelId === this.currentId));
      const shelfLabel: Label = this.labels.get(LabelType.shelfLabels).find((l => l.labelId === this.currentId));
      if (misread) {
        this.annotationMenu = AnnotationType.misread;
      } else if (out) {
        this.annotationMenu = AnnotationType.falsePositive;
      } else if (shelfLabel) {
        this.annotationMenu = AnnotationType.falseNegative;
      }
    }
  }

  // Set shortcuts based on categories info
  setHotkeys() {
    const newShortcuts = [];
    this.categories.forEach((annotationCategories: Array<AnnotationCategory>) => {
      annotationCategories.forEach(category => {
        newShortcuts.push(
          {
            key: category.hotkey,
            command: () => {
              this.changeAnnotation(category.categoryName);
            },
            preventDefault: true,
          },
        );
      });
    });
    newShortcuts.push(
      {
        key: 'del',
        command: () => {
          this.changeAnnotation(undefined);
        },
        preventDefault: true,
      },
    );
    this.shortcuts = newShortcuts;
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
    this.annotationMenu = AnnotationType.none;
    this.cancelZoom = true;
    if (!this.panoMode) {
      if (this.currentId !== label.labelId) {
        this.panoramaId.emit(label.labelId);
      } else {
        this.panoramaId.emit('-1');
      }
    }
  }

  getAnnotations(): Array<Annotation> {
    let labelAnnotations = [];
    if (this.qaMode) {
      if (this.misreadBarcodes && this.annotations.has(AnnotationType.misread)) {
        labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.misread));
      }
      if (this.currentlyDisplayed.includes(LabelType.shelfLabels) && this.annotations.has(AnnotationType.falseNegative)) {
        labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falseNegative));
      }
      if (this.currentlyDisplayed.includes(LabelType.outs)  && this.annotations.has(AnnotationType.falsePositive)) {
        labelAnnotations = labelAnnotations.concat(this.annotations.get(AnnotationType.falsePositive));
      }
    }
    return labelAnnotations;
  }

  annotationClicked(annotation: Annotation) {
    this.annotationMenu = AnnotationType.none;
    this.cancelZoom = true;
    if (this.currentId !== annotation.labelId) {
      this.panoramaId.emit(annotation.labelId);
    } else {
      this.panoramaId.emit('-1');
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
    this.annotationMenu = AnnotationType.none;
    this.selectedMarkerCategory = '';
    this.panoramaId.emit('-1');
  }

  // When a user chooses an annotation from the dropdown
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
      this.updateLabelCategory.emit({
        labelId: this.currentId,
        category: category,
        annotationType: this.annotationMenu,
      });
    }

    this.annotationMenu = AnnotationType.none;
  }

 // Css styles for annotation dropdown
  setMenuOptionStyles(category: string, hovered: number, i: number, color: string) {
    const styles = {};
    styles['background-color'] = 'white';
    styles['color'] = color;
    const annotation = this.getAnnotationById(this.currentId);
    if (this.annotationMenu === AnnotationType.missed && this.selectedMarkerCategory === category) {
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

   // Css styles for annotations
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

  // Displays missing barcode markers
  setMarkerStyles(annotation: Annotation) {
    const styles = {};
    styles['top.px'] = annotation.top - 35;
    styles['left.px'] = annotation.left - 35;
    styles['border-color'] = this.categories.get(AnnotationType.missed)
      .find((obj => obj.categoryName === annotation.annotationCategory)).color;
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
