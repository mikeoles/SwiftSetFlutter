import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  selectedDisplay: String;
  selectedIndex: Number;
  @Output() gridId = new EventEmitter();
  @Output() gridDisplay = new EventEmitter();
  @Input() panoramaSelectedId: Number;
  @Input() panoramaSelectedDisplay: String;

  constructor() { 
    this.selectedDisplay = "outs";
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    //update the current index when the user selects a row from one of the tables
    if(this.panoramaSelectedDisplay) this.selectedDisplay = this.panoramaSelectedDisplay;
    if(this.panoramaSelectedId) this.selectedIndex = this.panoramaSelectedId;
  }

  //Called when the user clicks one of the buttons to change tables
  selectTable(type){
    this.selectedDisplay = type;
    this.gridDisplay.emit(type);
  }

  //Called when the user clicks on one of the rows in the table
  productTableSelected(index){
    this.gridId.emit(index);
  }
}
