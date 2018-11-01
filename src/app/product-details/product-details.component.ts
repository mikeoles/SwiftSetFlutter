import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  selectedDisplay: string;
  selectedId: number;
  showPlugs: Boolean;
  showSuppliers: Boolean;
  
  @Output() gridId = new EventEmitter();
  @Output() gridDisplay = new EventEmitter();
  @Input() panoramaSelectedId: number;
  @Input() panoramaSelectedDisplay: string;

  constructor() { 
    this.selectedDisplay = "outs";
    this.showPlugs = environment.showPlugs;
    this.showSuppliers = environment.showSuppliers
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(this.panoramaSelectedDisplay!=null) this.selectedDisplay = this.panoramaSelectedDisplay;
    if(this.panoramaSelectedId!=null) this.selectedId = this.panoramaSelectedId;
  }

  //Called when the user clicks one of the buttons to change tables
  selectGrid(type){
    this.selectedDisplay = type;
    this.selectedId = null;
    this.gridDisplay.emit(type);
    this.gridId.emit(-1);    //Emit -1 to signal that no elements are selected
  }

  //Called when the user clicks on one of the rows in the table
  productGridSelected(id){
    if(id == this.selectedId){
      this.gridId.emit(-1);
    }else{
      this.gridId.emit(id);
    }
  }
}
