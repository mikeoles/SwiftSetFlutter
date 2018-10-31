import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import panzoom from 'panzoom';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit {
  @Input() outs: Observable<any[]>;
  @Input() labels: Observable<any[]>;
  @Input() gridSelectedId: Number;
  @Input() gridSelectedDisplay: String;
  @Output() panoramaId = new EventEmitter();
  @Output() panoramaDisplay = new EventEmitter();
  currentId: Number;
  currentDisplay: String;

  constructor() {
  }

  ngOnInit() {
    console.log('outs: ', this.outs);

    const element = document.getElementById('pano-image');
    panzoom(element, {
      maxZoom: 10,
      minZoom: 1,
      bounds: false,
    });
  }

  ngOnChanges(changes) {
    //update the current index when the user selects a row from one of the grids
    if(this.gridSelectedDisplay) this.currentDisplay = this.gridSelectedDisplay;
    if(this.gridSelectedId || this.gridSelectedId===0) this.currentId = this.gridSelectedId;
    if(this.currentId==-1) this.currentId = null;
  }

  annotationClicked(num,display){
      this.panoramaId.emit(num);
      this.panoramaDisplay.emit(display);
  }


}
