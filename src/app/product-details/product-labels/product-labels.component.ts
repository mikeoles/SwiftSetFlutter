import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-product-labels',
  templateUrl: './product-labels.component.html',
  styleUrls: ['./product-labels.component.scss','../table-styles.scss']
})
export class ProductLabelsComponent implements OnInit {

  selectedRow : Number;
  aboveSelectedRow: Number;

  labels: any[];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getLabels().subscribe(labels => this.labels = labels);
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.aboveSelectedRow = index-1;
  }

}
