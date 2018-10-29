import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  selectedDisplay: String;
  selectedIndex: Number;
  showPlugs: Boolean;
  showSuppliers: Boolean;
  
  @Output() gridId = new EventEmitter();
  @Output() gridDisplay = new EventEmitter();
  @Input() panoramaSelectedId: Number;
  @Input() panoramaSelectedDisplay: String;

  constructor() { 
    this.selectedDisplay = "outs";
    this.showPlugs = environment.showPlugs;
    this.showSuppliers = environment.showSuppliers
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    //update the current index when the user selects a row from one of the tables
    if(this.panoramaSelectedDisplay) this.selectedDisplay = this.panoramaSelectedDisplay;
    if(this.panoramaSelectedId || this.panoramaSelectedId == 0) this.selectedIndex = this.panoramaSelectedId;
  }

  //Called when the user clicks one of the buttons to change tables
  selectGrid(type){
    this.selectedDisplay = type;
    this.gridDisplay.emit(type);
    this.selectedIndex = null;
    this.gridId.emit(-1);    //Emit -1 to signal that no elements are selected
  }

  //Called when the user clicks on one of the rows in the table
  productGridSelected(index){
    if(index == this.selectedIndex){
      this.gridId.emit(-1);
    }else{
      this.gridId.emit(index);
    }
  }
}
