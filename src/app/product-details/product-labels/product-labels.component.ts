import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-product-labels',
  templateUrl: './product-labels.component.html',
  styleUrls: ['./product-labels.component.scss','../grid-styles.scss']
})
export class ProductLabelsComponent implements OnInit {

    @Output() labelsGridClicked = new EventEmitter();
    @Input() selectedIndex: number;
    selectedRow : number;
    labels: any[];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getLabels().subscribe(labels => this.labels = labels);
  }

  ngOnChanges(changes) {
    if(this.selectedIndex){
      this.selectedRow = this.selectedIndex;
    }
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.labelsGridClicked.emit(index);
  }

}
