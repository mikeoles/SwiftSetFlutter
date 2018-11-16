import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
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
  panZoomApi: any;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor() {
  }

  ngOnInit() {
    const element = document.getElementById('pano-image');
    this.panZoomApi = panzoom(element, {
      maxZoom: 10,
      minZoom: .12,
      bounds: false,
    });
    this.panZoomApi.zoomAbs(-10, -100, .15);

    element.addEventListener('touchend', (e: TouchEvent) => {
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
        this.panZoomApi.zoomAbs(30, 50, .3);
      } else {
        this.panZoomApi.zoomAbs(0, 0, .15);
      }
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
    if (this.currentId !== annotation.id) {
      this.panoramaId.emit(annotation.id);
    }
  }

  zoomIn() {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, 1.25);
    return false;
  }

  zoomOut() {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, .8);
    return false;
  }
}
