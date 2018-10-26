import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { compileNgModuleFactory__POST_NGCC__ } from '@angular/core/src/application_ref';

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

  constructor() { }

  ngOnInit() {
    console.log(this.outs);
  }

  ngOnChanges(changes) {
    //update the current index when the user selects a row from one of the tables
    if(this.gridSelectedDisplay) this.currentDisplay = this.gridSelectedDisplay;
    if(this.gridSelectedId) this.currentIndex = this.gridSelectedId;
  }

  annotationClicked(num,display){
      this.panoramaId.emit(num);
      this.panoramaDisplay.emit(display);
  }

  
}
