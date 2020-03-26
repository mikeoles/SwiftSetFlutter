import { Component, OnInit, Input } from '@angular/core';
import panzoom from 'panzoom';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-debug-panorama',
  templateUrl: './debug-panorama.component.html',
  styleUrls: ['./debug-panorama.component.scss']
})
export class DebugPanoramaComponent implements OnInit {

  @Input() panoramaUrl: string;

  panZoomApi: any;
  startingZoom = 0.30;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor() {
  }

  ngOnInit(): void {
    this.panZoomApi = panzoom(document.getElementById('pano-image'), {
      maxZoom: 10,
      minZoom: .12,
    });
    const interval = setInterval(() => {
      this.panZoomApi.zoomAbs(0, 0, this.startingZoom);
      clearInterval(interval);
    }, 10);
  }

  zoomIn(): boolean {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, 1.25);
    return false;
  }

  zoomOut(): boolean {
    this.panZoomApi.smoothZoom(window.innerWidth / 2, 182, 0.8);
    return false;
  }
}
