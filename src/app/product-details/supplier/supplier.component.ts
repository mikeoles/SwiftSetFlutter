import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss','../grid-styles.scss']
})

export class SupplierComponent implements OnInit {

  @Output() suppliersGridClicked = new EventEmitter();
  @Input() suppliers: any[];
  @Input() selectedId: number;

  ngOnInit() {
  }

  setClickedRow(id) {
    this.suppliersGridClicked.emit(id);
  }

}