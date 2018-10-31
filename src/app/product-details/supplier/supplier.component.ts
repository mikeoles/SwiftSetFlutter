import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss','../grid-styles.scss']
})

export class SupplierComponent implements OnInit {

    @Output() suppliersGridClicked = new EventEmitter();
    @Input() selectedId: number;
    selectedRow : number;
    suppliers: any[];

  constructor(private apiService: ApiService) {
    this.apiService.getLabels().subscribe(suppliers => this.suppliers = suppliers);
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(this.selectedId){
      this.setClickedRow(this.selectedId);
    }
  }

  setClickedRow(id){
    let i: number;
    this.selectedRow = -1;
    for(i=0; i<this.suppliers.length;i++){
      if(this.suppliers[i].Id==id){
        this.selectedRow = i;
      }
    }
    this.suppliersGridClicked.emit(id);
  }

}