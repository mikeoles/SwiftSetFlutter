import { Component, OnInit, Input, Output, EventEmitter, OnChanges, NgModule } from '@angular/core';
import panzoom from 'panzoom';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit {
  @Input() outs: any[];
  @Input() labels: any[];
  @Input() currentId: number;
  @Input() currentDisplay: string;
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
      minZoom: 1,
      bounds: false,
    });

    element.addEventListener('touchend', (e: TouchEvent) => {
      if (e.target instanceof HTMLElement) {
        const touchedElement = e.target as HTMLElement;
        if (touchedElement.classList.contains('annotation')) {
          touchedElement.click();
        }
      }
    });
  }

  annotationClicked(num, display) {
    if (this.currentId !== num) {
      this.panoramaId.emit(num);
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
