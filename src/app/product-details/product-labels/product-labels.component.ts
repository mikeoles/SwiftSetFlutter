import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-product-labels',
  templateUrl: './product-labels.component.html',
  styleUrls: ['./product-labels.component.scss','../table-styles.scss']
})
export class ProductLabelsComponent implements OnInit {

    @Output() labelsTableClicked = new EventEmitter();
    @Input() selectedIndex: Number;
    selectedRow : Number;
    aboveSelectedRow: Number;
    labels: any[];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getLabels().subscribe(labels => this.labels = labels);
  }

  ngOnChanges(changes) {
    //update the current index when the user selects a row from one of the tables
    if(this.selectedIndex) this.selectedRow = this.selectedIndex;
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.aboveSelectedRow = index-1;
    this.labelsTableClicked.emit(index);
  }

}
