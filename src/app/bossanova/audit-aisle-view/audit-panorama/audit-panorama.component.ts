import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import panzoom from 'panzoom';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Label from 'src/app/models/label.model';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { LabelType } from 'src/app/shared/label-type';

@Component({
  selector: 'app-audit-panorama',
  templateUrl: './audit-panorama.component.html',
  styleUrls: ['./audit-panorama.component.scss']
})
export class AuditPanoramaComponent implements OnInit, OnChanges {
  shortcuts: ShortcutInput[] = [];

  @Input() labels = new Map<LabelType, Array<Label>>();
  @Input() panoramaUrl: string;
  @Input() currentlyDisplayed: Array<LabelType>;
  @Input() labelsChanged: boolean;

  faPlus = faPlus;
  faMinus = faMinus;
  panZoomApi: any;
  startingZoomLevel = .3;

  constructor() {
  }

  ngOnInit() {
    this.panZoomApi = panzoom(document.getElementById('pano-image'), {
      maxZoom: 10,
      minZoom: 0.12,
      zoomDoubleClickSpeed: 1,
    });

    this.panZoomApi.zoomAbs(0, 0, this.startingZoomLevel);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.labelsChanged) {
      this.updateLabelBorderColors();
    }
  }

  // Sets border colors labels
  updateLabelBorderColors(): any {
    this.currentlyDisplayed.forEach(labelType => {
      const color = this.getColorByLabelType(labelType);
      const labels = this.labels.get(labelType);
      if (labels) {
        labels.forEach(label => {
          label.color = color;
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
