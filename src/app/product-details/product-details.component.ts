import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  showPlugs: Boolean;
  showSuppliers: Boolean;

  @Output() gridId = new EventEmitter();
  @Output() gridDisplay = new EventEmitter();
  @Input() outs: any[];
  @Input() labels: any[];
  @Input() currentId: number;
  @Input() currentDisplay: string;

  constructor() {
    this.showPlugs = environment.showPlugs;
    this.showSuppliers = environment.showSuppliers;
  }

  ngOnInit() {
  }

  // Called when the user clicks one of the buttons to change tables
  selectGrid(type) {
    this.gridDisplay.emit(type);
    this.gridId.emit(-1);    // Emit -1 to signal that no elements are selected
  }

  // Called when the user clicks on one of the rows in the table
  productGridSelected(id) {
    if (id === this.currentId) {
      this.gridId.emit(-1);
    } else {
      this.gridId.emit(id);
    }
  }
}
