import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Inject
} from '@angular/core';
import panzoom from 'panzoom';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Label from 'src/app/label.model';
import { EnvironmentService } from 'src/app/environment.service';
import { Permissions } from 'src/permissions/permissions';
import AnnotationCategory from 'src/app/annotationCategory.model';
import { ApiService } from 'src/app/api.service';
import MissedBarcode from 'src/app/missedBarcode.model';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

enum AnnotationType {
  misread = 'misread',
  missed = 'missed',
  falsePositive = 'falsePositive',
  falseNegative = 'falseNegative',
  none = 'none'
}

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss'],
})

export class PanoramaComponent implements OnInit, OnChanges {
  shortcuts: ShortcutInput[] = [];

  @Input() outs: Label[];
  @Input() labels: Label[];
  @Input() misreadBarcodes: Label[];
  @Input() sectionLabels: Label[];
  @Input() topStock: Label[];
  @Input() sectionBreaks: number[];
  @Input() currentId: number;
  @Input() panoramaUrl: string;
  @Input() panoMode: boolean;
  @Input() resetPano = false;
  @Input() resetPanoAfterExport = false;
  @Input() qaModesTurnedOn: Array<string>;
  @Input() currentlyDisplayed: Array<string>;

  @Output() panoramaId = new EventEmitter();
  @Output() panoramaTouched = new EventEmitter();
  @Output() updateLabelCategory = new EventEmitter<{labelId: number, category: string, action: string, annotationType: AnnotationType}>();
  @Output() updateMissedCategory = new EventEmitter<{barcode: MissedBarcode, action: string}>();

  misreadAnnotationCategories: AnnotationCategory[];
  missedAnnotationCategories: AnnotationCategory[];
  falsePositiveAnnotationCategories: AnnotationCategory[];
  falseNegativeAnnotationCategories: AnnotationCategory[];
  missedBarcodeMarkers: MissedBarcode[] = [];

  annotationMenu: AnnotationType = AnnotationType.none;
  annotationLeft = 0;
  annotationTop = 0;
  selectedAnnotation: Label;
  selectedMarkerCategory = '';
  url = '';
  positionSetByUrl = false;

  qaUser = false;
  cancelZoom = false;

  faPlus = faPlus;
  faMinus = faMinus;

  panZoomApi: any;
  startingZoomLevel = .13;
  panoZoomLevel = .25;
  zoomedInLevel = .5;
  panoHeight = 365;
  yOffset = 725;
  currentWidth = 0;
  currentHeight = 0;

  labelsColor = '#00CD87';
  outsColor = '#FFFFFF';
  misreadBarcodesColor = '#FF0000';
  sectionLabelsColor = '#800080';
  topStockColor = '#FFC0CB';
  selectedColor = '#FFD54A';

  constructor(private environment: EnvironmentService, private apiService: ApiService, 
    private location: Location, private router: Router, private activatedRoute: ActivatedRoute) {
    this.qaUser = environment.config.permissions.indexOf(Permissions.QA) > -1;
  }

  ngOnInit() {
    this.apiService.getMisreadCategories().subscribe(categories => {
      this.addCategories(this.misreadAnnotationCategories = categories);
    });

    this.apiService.getMissedCategories().subscribe(categories => {
      this.addCategories(this.missedAnnotationCategories = categories);
    });

    this.apiService.getFalsePositiveCategories().subscribe(categories => {
      this.addCategories(this.falsePositiveAnnotationCategories = categories);
    });

    this.apiService.getFalseNegativeCategories().subscribe(categories => {
      this.addCategories(this.falseNegativeAnnotationCategories = categories);
    });

    const element = document.getElementById('pano-image');
    const owner = document.getElementById('image-owner');
    const context = this;
    this.panZoomApi = panzoom(element, {
      maxZoom: 10,
      minZoom: 0.12,
      onDoubleClick: function(e: any) {
        if (context.qaModesTurnedOn.includes('missingBarcodes')) {
          context.selectedMarkerCategory = '';
          context.annotationLeft = e.offsetX;
          context.annotationTop = e.offsetY;
          context.annotationMenu = AnnotationType.missed;
        }
      },
      zoomDoubleClickSpeed: 1,
    });

    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams['zoom'] && queryParams['x'] && queryParams['y']) {
      const zoom: number = +queryParams['zoom'];
      const x: number = +queryParams['x'];
      const y: number = +queryParams['y'];
      this.panZoomApi.zoomAbs(0, 0, 1);
      this.panZoomApi.moveTo(x * (1 / zoom), y * (1 / zoom));
      this.panZoomApi.zoomAbs(0, 0, zoom);
      this.positionSetByUrl = true;
    }

    this.url = this.router.url;
    if (this.url.indexOf('?zoom') > -1) {
      this.url = this.url.substr(0, this.url.indexOf('?zoom'));
    }

    this.panZoomApi.on('transform', function(e) { // Export current position for url
      const p = context.panZoomApi.getTransform();
      context.location.go(
        context.url + '?zoom=' + parseFloat(p.scale).toFixed(2) + '&x=' + parseFloat(p.x).toFixed(2) + '&y=' + parseFloat(p.y).toFixed(2)
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
    element.addEventListener('touchend', (e: TouchEvent) => {
      this.panoramaTouched.emit(true);
      if (e.target instanceof HTMLElement) {
        const touchedElement = e.target as HTMLElement;
        if (touchedElement.classList.contains('annotation')) {
          touchedElement.click();
        }
      }
    });
  }

  addCategories(categories: AnnotationCategory[]): any {
    categories.forEach( category => {
      this.shortcuts.push(
        {
          key: category.hotkey,
          command: () => this.setCategory(category.categoryName),
          preventDefault: true
        }
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outs'] || changes['misreadBarcodes'] || changes['labels'] ||
      changes['currentId'] || changes['currentlyDisplayed'] || changes['qaModesTurnedOn']) {
        this.updateLabelBorders(this.outs, this.outsColor, 'outs');
        this.updateLabelBorders(this.labels, this.labelsColor, 'shelfLabels');
        this.updateLabelBorders(this.misreadBarcodes, this.misreadBarcodesColor, 'misreadBarcodes');
        this.updateLabelBorders(this.topStock, this.topStockColor, 'topStock');
        this.updateLabelBorders(this.sectionLabels, this.sectionLabelsColor, 'sectionLabels');
    }

    if (changes['qaModesTurnedOn']) {
      if (!changes['qaModesTurnedOn'].currentValue.includes('missingBarcodes')) {
        this.annotationMenu = AnnotationType.none;
      }
    }

    if (this.panZoomApi) {
      if (changes['panoMode']) {
        const element = document.getElementById('pano-image');
        this.centerImage(element.offsetWidth, element.offsetHeight);
      } else if (changes['resetPano'] !== undefined) {
        this.resetZoom();
      } else if (changes['resetPanoAfterExport'] !== undefined) {
        const element = document.getElementById('pano-image');
        const a = this;
        this.panZoomApi = panzoom(element, {
          maxZoom: 10,
          minZoom: .12,
        });
        setTimeout(() => {
          a.resetZoom();
        },
        100);
      } else {
        if (this.currentId && this.currentId !== -1 && !this.cancelZoom) {
          let selectedX: number, selectedY: number, i: number, currentZoomLevel = this.panZoomApi.getTransform().scale;
          const annotations: Label[] = [].concat(this.outs, this.labels, this.sectionLabels, this.topStock);

          if (currentZoomLevel < this.zoomedInLevel) {
            currentZoomLevel = this.zoomedInLevel;
          }

          for (i = 0; i < annotations.length; i++) {
            if (annotations[i].labelId === this.currentId) {
              this.showOrHideAnnotationOptions(annotations[i]);
              selectedX =
                annotations[i].bounds.left +
                annotations[i].bounds.width / 2 -
                (window.screen.width / 2) * (1 / currentZoomLevel);
              selectedY =
                annotations[i].bounds.top +
                annotations[i].bounds.height / 2 -
                (this.panoHeight / 2) * (1 / currentZoomLevel);
            }
          }

          this.panZoomApi.zoomAbs(0, 0, 1);
          this.panZoomApi.moveTo(selectedX * -1, selectedY * -1);
          this.panZoomApi.zoomAbs(0, 0, currentZoomLevel);

        } else if (this.currentId === null) {
          const element = document.getElementById('pano-image');
          if (!this.positionSetByUrl) { // if pano positions hasnt already been set by url params
            this.positionSetByUrl = false;
            const interval = setInterval(() => {
              if (element.offsetWidth !== 0 && element.offsetWidth !== this.currentWidth) {
                this.centerImage(element.offsetWidth, element.offsetHeight);
                this.currentWidth = element.offsetWidth;
                this.currentHeight = element.offsetHeight;
                clearInterval(interval);
              }
            }, 10);
          }
        }
      }
      this.cancelZoom = false;
    }
  }

  updateLabelBorders(labels: Label[], color: string, name: string): any {
    if (labels && this.currentlyDisplayed.includes(name)) {
      labels.forEach(label => {
        const annotationModes = Object.keys(label.annotations);
        if (label.labelId === this.currentId) { // selected color
          label.annotationColor = this.selectedColor;
        } else if (annotationModes.length > 0) { // annotated color
          const categoriesList = this.categories(annotationModes[0]);
          const categoryName = label.annotations[annotationModes[0]]; // pick first annotation if multiple
          categoriesList.forEach( category => {
            if (category.categoryName === categoryName) {
              label.annotationColor = category.color;
            }
          });
        } else { // regular color
          label.annotationColor = color;
        }
      });
    }
  }

  annotations(displayType: string) {
    switch (displayType) {
      case 'outs':
        return this.outs;
      case 'shelfLabels':
        return this.labels;
      case 'sectionLabels':
        return this.sectionLabels;
      case 'topStock':
        return this.topStock;
      case 'misreadBarcodes':
        return this.misreadBarcodes;
    }
  }

  categories(annotationName: string) {
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

  showOrHideAnnotationOptions(annotation: Label) { // Determines wether to show the popup for annotation options
    this.annotationMenu = AnnotationType.none;
    const isMissingBarcode = this.misreadBarcodes.findIndex((label => label.labelId === annotation.labelId)) > -1;
    const isOut = this.outs.findIndex((label => label.labelId === annotation.labelId)) > -1;
    const isLabel = this.labels.findIndex((label => label.labelId === annotation.labelId)) > -1;
    if (this.currentlyDisplayed.includes('misreadBarcodes') && isMissingBarcode && this.qaModesTurnedOn.includes('misreadBarcodes')) {
      this.annotationMenu = AnnotationType.misread;
    } else if (this.currentlyDisplayed.includes('outs') && isOut && this.qaModesTurnedOn.includes('falsePositives')) {
      this.annotationMenu = AnnotationType.falsePositive;
    } else if (this.currentlyDisplayed.includes('shelfLabels') && !isOut && isLabel && this.qaModesTurnedOn.includes('falseNegatives')) {
      this.annotationMenu = AnnotationType.falseNegative;
    }
    if (this.annotationMenu !== AnnotationType.none) {
      this.annotationLeft = annotation.bounds.left + annotation.bounds.width + 20; // Set bounds for annotation options pane
      this.annotationTop = annotation.bounds.top - annotation.bounds.height;
      this.selectedAnnotation = annotation;
    }
  }

  centerImage(imageWidth: number, imageHeight: number) {
    let moveX = 0;
    let moveY = this.yOffset;
    let zoom = this.startingZoomLevel;
    if (this.panoMode) {
      zoom = this.panoZoomLevel;
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

  annotationClicked(annotation: Label) {
    this.showOrHideAnnotationOptions(annotation);
    if (!this.panoMode) {
      if (this.currentId !== annotation.labelId) {
        if (this.annotationMenu === AnnotationType.missed) {
          this.annotationMenu = AnnotationType.none;
        }
        this.panoramaId.emit(annotation.labelId);
      } else {
        this.annotationMenu = AnnotationType.none; // hide annotation menu when unselected
        this.panoramaId.emit(-1);
      }
      this.cancelZoom = true;
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

  resetZoom() {
    this.centerImage(this.currentWidth, this.currentHeight);
  }

  panoTouched() {
    this.annotationMenu = AnnotationType.none;
    this.selectedMarkerCategory = '';
    this.panoramaId.emit(-1);
  }

  deleteCategory() {
    this.cancelZoom = true;
    if (this.annotationMenu === AnnotationType.none) {
      return;
    } else if (this.annotationMenu === AnnotationType.missed) {
      const index = this.missedBarcodeMarkers.findIndex((obj => obj.left === this.annotationLeft && obj.top === this.annotationTop));
      if (index > -1) {
        this.updateMissedCategory.emit({
          barcode: this.missedBarcodeMarkers[index],
          action: 'delete'
        });
        this.missedBarcodeMarkers.splice(index, 1);
      }
    } else {
      this.updateLabelCategory.emit({
        labelId: this.selectedAnnotation.labelId,
        category: '',
        action: 'delete',
        annotationType: this.annotationMenu
      });
    }
    this.annotationMenu = AnnotationType.none;
  }

  setCategory(category: string) {
    this.cancelZoom = true;
    if ( this.annotationMenu === AnnotationType.none) {
      return;
    } else if ( this.annotationMenu === AnnotationType.missed) {
      let index = this.missedBarcodeMarkers.findIndex((obj => obj.left === this.annotationLeft && obj.top === this.annotationTop));
      const action = index > -1 ? 'update' : 'add';
      if (index > -1) { // edit if already exists
        this.missedBarcodeMarkers[index].categoryName = category;
      } else { // create new missed barcode marker
        index = this.missedBarcodeMarkers.push({
          top: this.annotationTop,
          left: this.annotationLeft,
          categoryName: category
        }) - 1;
      }
      this.updateMissedCategory.emit({
        barcode: this.missedBarcodeMarkers[index],
        action: action
      });
     } else {
      this.updateLabelCategory.emit({
        labelId: this.selectedAnnotation.labelId,
        category: category,
        action: this.selectedAnnotation.annotations[this.annotationMenu] ? 'update' : 'add', // todo
        annotationType: this.annotationMenu
      });
    }
    this.annotationMenu = AnnotationType.none;
  }

  setAnnotationStyles(category: string, hovered: number, i: number, color: string) {
    const styles = {};
    styles['background-color'] = 'white';
    styles['color'] = color;
    if (this.annotationMenu === AnnotationType.missed && this.selectedMarkerCategory === category) {
      styles['background-color'] = 'lightgray'; // highlight the currently selected color light gray
    } else if (this.selectedAnnotation && this.selectedAnnotation.annotations[this.annotationMenu] === category) {
      styles['background-color'] = 'lightgray'; // highlight the currently selected color light gray
    }
    if (hovered === i) {
      styles['color'] = 'white';
      styles['background-color'] = color;
    }
    return styles;
  }

  setMarkerStyles(top: number, left: number, category: string) {
    const styles = {};
    styles['top.px'] = top - 35;
    styles['left.px'] = left - 35;
    const index = this.missedAnnotationCategories.findIndex((obj => obj.categoryName === category));
    styles['border-color'] = this.missedAnnotationCategories[index].color;
    return styles;
  }

  editMarker(index: number) {
    const selected: MissedBarcode = this.missedBarcodeMarkers[index];
    this.annotationTop = selected.top;
    this.annotationLeft = selected.left;
    this.selectedMarkerCategory = selected.categoryName;
    this.annotationMenu = AnnotationType.missed;
  }
}
