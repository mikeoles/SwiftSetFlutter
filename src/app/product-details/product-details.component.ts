import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  selectedTable: string;

  constructor() { 
    this.selectedTable = "outs";
  }

  ngOnInit() {
  }

  selectTable(type){
    this.selectedTable = type;
  }

}
