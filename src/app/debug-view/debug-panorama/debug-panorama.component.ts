import { Component, OnInit, Input } from '@angular/core';
import panzoom from 'panzoom';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Detection from 'src/app/models/detection.model';
import AssociationCoordinate from 'src/app/models/associationCoordinate.model';

@Component({
  selector: 'app-debug-panorama',
  templateUrl: './debug-panorama.component.html',
  styleUrls: ['./debug-panorama.component.scss']
})
export class DebugPanoramaComponent implements OnInit {

  @Input() panoramaUrl: string;
  @Input() displayedDetections = new Map<string, Detection>();


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

  // Return start and end coorinates for each association line for a detection
  getLineCoordinates(detectionId: string, associations: string[]): Array<AssociationCoordinate> {
    const coordinates = new Array<AssociationCoordinate>();
    const fromDetection = this.displayedDetections.get(detectionId);
    associations.forEach(associationId => {
      if (this.displayedDetections.has(associationId)) {
        const toDetection = this.displayedDetections.get(associationId);
        coordinates.push({
          x1: fromDetection.bounds.left + fromDetection.bounds.width / 2 + 10, // add 10px for border width
          y1: fromDetection.bounds.top + fromDetection.bounds.height / 2 + 10,
          x2: toDetection.bounds.left + toDetection.bounds.width / 2 + 10,
          y2: toDetection.bounds.top + toDetection.bounds.height / 2 + 10,
        });
      }
    });
    return coordinates;
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
