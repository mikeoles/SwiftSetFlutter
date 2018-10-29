import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit {
  @Input() outs: Observable<any[]>;
  @Input() gridSelectedId: Number;
  @Input() gridSelectedDisplay: String;
  @Output() panoramaId = new EventEmitter();
  @Output() panoramaDisplay = new EventEmitter();
  currentIndex: Number;
  currentDisplay: String;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    //update the current index when the user selects a row from one of the grids
    if(this.gridSelectedDisplay) this.currentDisplay = this.gridSelectedDisplay;
    if(this.gridSelectedId || this.gridSelectedId===0) this.currentIndex = this.gridSelectedId;
    if(this.currentIndex==-1) this.currentIndex = null;
  }

  annotationClicked(num,display){
      this.panoramaId.emit(num);
      this.panoramaDisplay.emit(display);
  }

  
}
