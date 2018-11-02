import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import panzoom from 'panzoom';
import Hammer from 'hammerjs';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit, OnChanges {
  @Input() outs: Observable<any[]>;
  @Input() labels: Observable<any[]>;
  @Input() currentId: number;
  @Input() currentDisplay: string;
  @Output() panoramaId = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    console.log('outs: ', this.outs);

    const element = document.getElementById('pano-image');
    // const hammertime = new Hammer(element);
    // hammertime.on('tap', function(ev) {
    //   //This is called only on tap events
    //   console.log('tap', ev);
    // });
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

  ngOnChanges(changes) {
    // update the current index when the user selects a row from one of the grids
    // if(this.currentDisplay) this.currentDisplay = this.currentDisplay;
    // if(this.currentId!=null) this.currentId = this.currentId;
    // if(this.currentId==-1) this.currentId = null;
  }

  annotationClicked(num, display) {
    if (this.currentId !== num) {
      this.panoramaId.emit(num);
    }
  }
}
