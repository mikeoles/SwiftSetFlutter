import { Component, OnInit, Input, Output, EventEmitter, OnChanges, NgModule } from '@angular/core';
import panzoom from 'panzoom';

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

  constructor() {
  }

  ngOnInit() {
    console.log('outs: ', this.outs);

    const element = document.getElementById('pano-image');
    panzoom(element, {
      maxZoom: 10,
      minZoom: 1,
      bounds: false,
      onTouch: function(e) {
        console.log('onTouch', e);
        return true;
      }
    });
  }

  annotationClicked(num, display) {
    if (this.currentId !== num) {
      this.panoramaId.emit(num);
    }
  }
}
