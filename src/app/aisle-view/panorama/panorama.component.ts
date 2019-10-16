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
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit, OnChanges {
  @Input() outs: Label[];
  @Input() labels: Label[];
  @Input() misreadBarcodes: Label[];
  @Input() sectionLabels: Label[];
  @Input() topStock: Label[];
  @Input() sectionBreaks: number[];

  @Input() showOuts: boolean;
  @Input() showShelfLabels: boolean;
  @Input() showSectionLabels: boolean;
  @Input() showSectionBreaks: boolean;
  @Input() showTopStock: boolean;

  @Input() currentId: number;
  @Input() panoramaUrl: string;
  @Input() panoMode: boolean;
  @Input() resetPano = false;
  @Input() resetPanoAfterExport = false;
  @Input() downloadPano = false;
  @Input() debugMode = false;
  @Input() missingBarcodesMode = false;
  @Input() currentlyDisplayed: Array<string>;

  @Output() panoramaId = new EventEmitter();
  @Output() panoramaTouched = new EventEmitter();
  @Output() addMisreadCategory = new EventEmitter<{labelId: number, category: string}>();
  @Output() changeMisreadCategory = new EventEmitter<{labelId: number, category: string}>();
  @Output() deleteMisreadCategory = new EventEmitter<number>();
  @Output() addMissedCategory = new EventEmitter<MissedBarcode>();
  @Output() changeMissedCategory = new EventEmitter<MissedBarcode>();
  @Output() deleteMissedCategory = new EventEmitter<MissedBarcode>();

  misreadAnnotationCategories: AnnotationCategory[];
  missedAnnotationCategories: AnnotationCategory[];
  misreadCategoryColors = new Map<string, string>();
  missedCategoryColors = new Map<string, string>();
  missedBarcodeMarkers: MissedBarcode[] = [];
  qaUser = false;
  annotationMenu = '';
  selectedIdWithPano = false;
  annotationLeft = 0;
  annotationTop = 0;
  selectedMarker = false;

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
  selectedAnnotation: Label;

  constructor(private environment: EnvironmentService, @Inject('ApiService') private apiService: ApiService,
    private keyboard: KeyboardShortcutsService) {
    this.qaUser = environment.config.permissions.indexOf(Permissions.QA) > -1;
  }

  ngOnInit() {
    this.apiService.getMisreadCategories().subscribe(categories => {
      this.misreadAnnotationCategories = categories;
      this.misreadAnnotationCategories.forEach( category => {
        this.misreadCategoryColors.set(category.category, category.color);
        this.keyboard.add([
          {
            key: category.hotkey,
            command: () => this.setCategory(category.category, 'missing'),
            preventDefault: true
          }
        ]);
      });
    });

    this.apiService.getMissedCategories().subscribe(categories => {
      this.missedAnnotationCategories = categories;
      this.missedAnnotationCategories.forEach( category => {
        this.missedCategoryColors.set(category.category, category.color);
        this.keyboard.add([
          {
            key: category.hotkey,
            command: () => this.setCategory(category.category, 'missed'),
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
        if (context.missingBarcodesMode) {
          context.annotationLeft = e.offsetX;
          context.annotationTop = e.offsetY;
          context.annotationMenu = 'missed';
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
      if (changes['missingBarcodesMode']) {
        if (changes['missingBarcodesMode'].currentValue === false) {
          this.annotationMenu = '';
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
        if (this.currentId && this.currentId !== -1 && !this.selectedIdWithPano) {
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
      this.selectedIdWithPano = false;
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
      case 'missed':
        return this.missedAnnotationCategories;
      case 'misread':
        return this.misreadAnnotationCategories;
    }
  }

  showOrHideAnnotationOptions(annotation: Label) { // Determines wether to show the popup for annotation options
    let isMissingBarcode = false;
    this.misreadBarcodes.forEach(missingBarcode => {
      if (missingBarcode.labelId === annotation.labelId) {
        isMissingBarcode = true;
      }
    });
    if (this.currentlyDisplayed.includes('misreadBarcodes') && isMissingBarcode && this.qaUser) {
      this.annotationMenu = 'misread';
    }
    this.annotationLeft = annotation.bounds.left + annotation.bounds.width + 20; // Set bounds for annoation options pane
    this.annotationTop = annotation.bounds.top - annotation.bounds.height;
    this.selectedAnnotation = annotation;
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
        if (this.annotationMenu === 'missed') {
          this.annotationMenu = '';
        }
        this.panoramaId.emit(annotation.labelId);
      } else {
        this.annotationMenu = ''; // hide annotation menu when unselected
        this.panoramaId.emit(-1);
      }
      this.selectedIdWithPano = true;
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
    this.annotationMenu = '';
  }

  deleteCategory() {
    if (this.annotationMenu === 'missed') {
      const index = this.missedBarcodeMarkers.findIndex((obj => obj.left === this.annotationLeft && obj.top === this.annotationTop));
      if (index > -1) {
        this.deleteMissedCategory.emit(this.missedBarcodeMarkers[index]);
        this.missedBarcodeMarkers.splice(index, 1);
      }
    }

    if (this.annotationMenu === 'misread' && this.selectedAnnotation.misreadType.length > 0) {
      this.deleteMisreadCategory.emit(this.selectedAnnotation.labelId);
    }

    this.annotationMenu = '';
  }

  // If type can be set to missed or misread, if none then determine based on annotation menu type
  setCategory(category: string, type: string = 'none') {
    if (type === 'missed' || this.annotationMenu === 'missed') {
      if (this.selectedMarker) { // edit marker
        const index = this.missedBarcodeMarkers.findIndex((obj => obj.left === this.annotationLeft && obj.top === this.annotationTop));
        this.missedBarcodeMarkers[index].category = category;
        this.changeMissedCategory.emit(this.missedBarcodeMarkers[index]);
        this.selectedMarker = false;
      } else { // create new marker
        const length = this.missedBarcodeMarkers.push({
          top: this.annotationTop,
          left: this.annotationLeft,
          category: category
        });
        this.addMissedCategory.emit(this.missedBarcodeMarkers[length - 1]);
      }
    }

    if (type === 'misread' || this.annotationMenu === 'misread') {
      if (this.selectedAnnotation.misreadType) {
        this.changeMisreadCategory.emit({
          labelId: this.selectedAnnotation.labelId,
          category: category
        });
      } else {
        this.addMisreadCategory.emit({
          labelId: this.selectedAnnotation.labelId,
          category: category
        });
      }
    }

    this.annotationMenu = '';

  }

  setAnnotationStyles(category: string, hovered: number, i: number, color: string) {
    const styles = {};
    styles['background-color'] = 'white';
    styles['color'] = color;
    if (this.selectedAnnotation && this.selectedAnnotation.misreadType === category && this.annotationMenu === 'misread') {
      styles['background-color'] = 'lightgrey';
    }
    if (hovered === i) {
      styles['color'] = 'black';
    }
    return styles;
  }

  setLabelStyles(displayType: string, annotation: Label) {
    const styles = {};
    styles['left.px'] = annotation.bounds.left;
    styles['top.px'] = annotation.bounds.top;
    styles['width.px'] = annotation.bounds.width;
    styles['height.px'] = annotation.bounds.height;
    if (displayType === 'misreadBarcodes' && annotation.labelId !== this.currentId) {
      styles['border-color'] = this.misreadCategoryColors.get(annotation.misreadType);
    }
    return styles;
  }

  setMarkerStyles(top: number, left: number, category: string) {
    const styles = {};
    styles['top.px'] = top - 35;
    styles['left.px'] = left - 35;
    styles['border-color'] = this.missedCategoryColors.get(category);
    return styles;
  }

  editMarker(index: number) {
    const selected: MissedBarcode = this.missedBarcodeMarkers[index];
    this.annotationTop = selected.top;
    this.annotationLeft = selected.left;
    this.annotationMenu = 'missed';
    this.selectedMarker = true;
  }
}
