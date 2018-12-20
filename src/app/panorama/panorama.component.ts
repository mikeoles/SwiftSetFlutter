import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
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
  startingZoomLevel = 0.15;
  zoomedInLevel = 0.5;
  panoHeight = 365;
  constructor() {}

  ngOnInit() {
    const element = document.getElementById('pano-image');
    this.panZoomApi = panzoom(element, {
      maxZoom: 10,
      minZoom: 0.12,
      bounds: false
    });
    this.panZoomApi.zoomAbs(-10, -100, this.startingZoomLevel);

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

  ngOnChanges() {
    if (this.panZoomApi) {
      if (this.panoMode) {
        this.panZoomApi.zoomAbs(30, 50, 0.3);
      } else if (this.currentId && this.currentId !== -1 && !this.selectedIdWithPano) {
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
              this.panZoomApi.zoomAbs(0, 0, 1);
              this.panZoomApi.moveTo(selectedX * -1, selectedY * -1);
              break;
            }
          }
        this.panZoomApi.zoomAbs(0, 0, currentZoomLevel);
      } else if (this.currentId === null) {
        this.panZoomApi.zoomAbs(0, 0, this.startingZoomLevel);
        this.panZoomApi.moveTo(0, 0);
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
