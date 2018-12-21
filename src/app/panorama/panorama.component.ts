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

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit, OnChanges {
  @Input() outs: any[];
  @Input() labels: any[];
  @Input() currentId: number;
  @Input() currentDisplay: string;
  @Input() panoramaUrl: string;
  @Input() panoMode: boolean;
  @Output() panoramaId = new EventEmitter();
  @Output() panoramaTouched = new EventEmitter();
  selectedIdWithPano = false;
  panZoomApi: any;
  faPlus = faPlus;
  faMinus = faMinus;
  startingZoomLevel = .17;
  panoZoomLevel = .25;
  zoomedInLevel = .5;
  panoHeight = 365;
  yOffset = 750;
  currentWidth = 0;
  currentHeight = 0;
  constructor() {}

  ngOnInit() {

    const element = document.getElementById('pano-image');
    const owner = document.getElementById('image-owner');

    this.panZoomApi = panzoom(element, {
      maxZoom: 10,
      minZoom: 0.12,
    });

    owner.addEventListener('touchend', (e: TouchEvent) => {
      if ((this.panZoomApi.getTransform().x > window.screen.width) ||
      (this.panZoomApi.getTransform().x * -1 > this.currentWidth * this.panZoomApi.getTransform().scale) ||
      (this.panZoomApi.getTransform().y > this.panoHeight) ||
      (this.panZoomApi.getTransform().y * -1 > (this.panoHeight + this.yOffset * this.panZoomApi.getTransform().scale))) {
        this.centerImage(this.currentWidth);
      }
    });

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
      if (changes['panoMode']) {
        const element = document.getElementById('pano-image');
        this.centerImage(element.offsetWidth);
      } else {
        if (this.currentId && this.currentId !== -1 && !this.selectedIdWithPano) {

          const annotations = this.annotations();
          let selectedX: number, selectedY: number, i: number;
          let currentZoomLevel = this.panZoomApi.getTransform().scale;
          if (currentZoomLevel < this.zoomedInLevel) {
            currentZoomLevel = this.zoomedInLevel;
          }

          for (i = 0; i < annotations.length; i++) {
            if (annotations[i].id === this.currentId) {
              selectedX =
                annotations[i].bounds.left +
                annotations[i].bounds.width / 2 -
                (window.screen.width / 2) * (1 / currentZoomLevel);
              selectedY =
                annotations[i].bounds.top +
                annotations[i].bounds.height / 2 -
                (this.panoHeight / 2) * (1 / currentZoomLevel);
              break;
            }
          }

          this.panZoomApi.zoomAbs(0, 0, 1);
          this.panZoomApi.moveTo(selectedX * -1, selectedY * -1);
          this.panZoomApi.zoomAbs(0, 0, currentZoomLevel);

        } else if (this.currentId === null) {
          const element = document.getElementById('pano-image');
          const interval = setInterval(() => {
            if (element.offsetWidth !== 0 && element.offsetWidth !== this.currentWidth) {
              this.centerImage(element.offsetWidth);
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

  annotations() {
    switch (this.currentDisplay) {
      case 'outs':
        return this.outs;
      case 'labels':
        return this.labels;
    }
  }

  centerImage(imageWidth: number) {
    let moveX = 0;
    let zoom = this.startingZoomLevel;
    if (this.panoMode) {
      zoom = this.panoZoomLevel;
    }
    // If image is smaller than screen, center image
    if (imageWidth * this.startingZoomLevel < window.innerWidth) {
      moveX = (imageWidth / 2) - (window.innerWidth / 2) * (1 / zoom);
    }

    this.panZoomApi.zoomAbs(0, 0, 1);
    this.panZoomApi.moveTo(moveX * -1, this.yOffset * -1);
    this.panZoomApi.zoomAbs(0, 0, zoom);
  }

  annotationClicked(annotation) {
    if (!this.panoMode) {
      if (this.currentId !== annotation.id) {
        this.panoramaId.emit(annotation.id);
      } else {
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
}
