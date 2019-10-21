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
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import MissedBarcode from 'src/app/missedBarcode.model';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss'],
})

export class PanoramaComponent implements OnInit, OnChanges {
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
  @Output() updateMisreadCategory = new EventEmitter<{labelId: number, category: string, action: string}>();
  @Output() updateMissedCategory = new EventEmitter<{barcode: MissedBarcode, action: string}>();

  misreadAnnotationCategories: AnnotationCategory[];
  missedAnnotationCategories: AnnotationCategory[];
  missedBarcodeMarkers: MissedBarcode[] = [];

  annotationMenu: AnnotationType = AnnotationType.none; // missing or misread
  annotationLeft = 0;
  annotationTop = 0;
  selectedAnnotation: Label;
  selectedMarkerCategory = '';

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

  constructor(private environment: EnvironmentService, @Inject('ApiService') private apiService: ApiService,
    private keyboard: KeyboardShortcutsService) {
    this.qaUser = environment.config.permissions.indexOf(Permissions.QA) > -1;
  }

  ngOnInit() {
    this.apiService.getMisreadCategories().subscribe(categories => {
      this.misreadAnnotationCategories = categories;
      this.misreadAnnotationCategories.forEach( category => {
        this.keyboard.add([
          {
            key: category.hotkey,
            command: () => this.setCategory(category.category, AnnotationType.misread),
            preventDefault: true
          }
        ]);
      });
    });

    this.apiService.getMissedCategories().subscribe(categories => {
      this.missedAnnotationCategories = categories;
      this.missedAnnotationCategories.forEach( category => {
        this.keyboard.add([
          {
            key: category.hotkey,
            command: () => this.setCategory(category.category, AnnotationType.missed),
            preventDefault: true
          }
        ]);
      });
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.panZoomApi) {
      if (changes['qaModesTurnedOn']) {
        if (!changes['qaModesTurnedOn'].currentValue.includes('missingBarcodes')) {
          this.annotationMenu = AnnotationType.none;
        }
      }
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
      this.cancelZoom = false;
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

  categories() {
    switch (this.annotationMenu) {
      case AnnotationType.missed:
        return this.missedAnnotationCategories;
      case AnnotationType.misread:
        return this.misreadAnnotationCategories;
    }
  }

  showOrHideAnnotationOptions(annotation: Label) { // Determines wether to show the popup for annotation options
    this.annotationMenu = AnnotationType.none;
    const isMissingBarcode = this.misreadBarcodes.findIndex((obj => obj.labelId === annotation.labelId)) > -1;
    if (this.currentlyDisplayed.includes('misreadBarcodes') && isMissingBarcode && this.qaUser) {
      this.annotationMenu = AnnotationType.misread;
      this.annotationLeft = annotation.bounds.left + annotation.bounds.width + 20; // Set bounds for annoation options pane
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
  }

  deleteCategory() {
    if (this.annotationMenu === AnnotationType.missed) {
      const index = this.missedBarcodeMarkers.findIndex((obj => obj.left === this.annotationLeft && obj.top === this.annotationTop));
      if (index > -1) {
        this.updateMissedCategory.emit({
          barcode: this.missedBarcodeMarkers[index],
          action: 'delete'
        });
        this.missedBarcodeMarkers.splice(index, 1);
      }
    }

    if (this.annotationMenu === AnnotationType.misread && this.selectedAnnotation.misreadType.length > 0) {
      this.updateMisreadCategory.emit({
        labelId: this.selectedAnnotation.labelId,
        category: '',
        action: 'delete'
      });
    }
    this.annotationMenu = AnnotationType.none;
    this.cancelZoom = true;
  }

  setCategory(category: string, type: string = AnnotationType.none) { // use type for hotkeys and annotationMenu for menu click
    if (type === AnnotationType.missed || this.annotationMenu === AnnotationType.missed) {
      let index = this.missedBarcodeMarkers.findIndex((obj => obj.left === this.annotationLeft && obj.top === this.annotationTop));
      const action = index > -1 ? 'update' : 'add';
      if (index > -1) { // edit if already exists
        this.missedBarcodeMarkers[index].category = category;
      } else { // create new missed barcode marker
        index = this.missedBarcodeMarkers.push({
          top: this.annotationTop,
          left: this.annotationLeft,
          category: category
        }) - 1;
      }
      this.updateMissedCategory.emit({
        barcode: this.missedBarcodeMarkers[index],
        action: action
      });
    }

    if (type === AnnotationType.misread || this.annotationMenu === AnnotationType.misread) {
      this.updateMisreadCategory.emit({
        labelId: this.selectedAnnotation.labelId,
        category: category,
        action: this.selectedAnnotation.misreadType ? 'update' : 'add'
      });
    }
    this.annotationMenu = AnnotationType.none;
    this.cancelZoom = true;
  }

  setAnnotationStyles(category: string, hovered: number, i: number, color: string) {
    const styles = {};
    styles['background-color'] = 'white';
    styles['color'] = color;
    if ((this.annotationMenu === AnnotationType.misread && this.selectedAnnotation && this.selectedAnnotation.misreadType === category) ||
        (this.annotationMenu === AnnotationType.missed && this.selectedMarkerCategory === category)) {
      styles['background-color'] = 'lightgray'; // highlight the currently selected color light gray
    }
    if (hovered === i) {
      styles['color'] = 'white';
      styles['background-color'] = color;
    }
    return styles;
  }

  setLabelStyles(displayType: string, annotation: Label) {
    const styles = {};
    styles['left.px'] = annotation.bounds.left;
    styles['top.px'] = annotation.bounds.top;
    styles['width.px'] = annotation.bounds.width;
    styles['height.px'] = annotation.bounds.height;
    if (this.misreadAnnotationCategories && displayType === 'misreadBarcodes' && annotation.labelId !== this.currentId) {
      const index = this.misreadAnnotationCategories.findIndex((obj => obj.category === annotation.misreadType));
      if (index > -1) {
        styles['border-color'] = this.misreadAnnotationCategories[index].color;
      }
    }
    return styles;
  }

  setMarkerStyles(top: number, left: number, category: string) {
    const styles = {};
    styles['top.px'] = top - 35;
    styles['left.px'] = left - 35;
    const index = this.missedAnnotationCategories.findIndex((obj => obj.category === category));
    styles['border-color'] = this.missedAnnotationCategories[index].color;
    return styles;
  }

  editMarker(index: number) {
    const selected: MissedBarcode = this.missedBarcodeMarkers[index];
    this.annotationTop = selected.top;
    this.annotationLeft = selected.left;
    this.selectedMarkerCategory = selected.category;
    this.annotationMenu = AnnotationType.missed;
  }
}

enum AnnotationType {
  misread = 'misread',
  missed = 'missed',
  none = 'none'
}
