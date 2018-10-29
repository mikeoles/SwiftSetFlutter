import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss','../grid-styles.scss']
})

export class SupplierComponent implements OnInit {

    @Output() spreadsGridClicked = new EventEmitter();
    @Input() selectedIndex: number;
    selectedRow : number;
    suppliers: any[];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getLabels().subscribe(suppliers => this.suppliers = suppliers);
  }

  ngOnChanges(changes) {
    if(this.selectedIndex){
      this.selectedRow = this.selectedIndex;
    }
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.spreadsGridClicked.emit(index);
  }

}