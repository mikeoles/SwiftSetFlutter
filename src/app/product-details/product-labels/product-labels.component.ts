import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-product-labels',
  templateUrl: './product-labels.component.html',
  styleUrls: ['./product-labels.component.scss','../grid-styles.scss']
})
export class ProductLabelsComponent implements OnInit {

    @Output() labelsGridClicked = new EventEmitter();
    @Input() selectedId: number;
    selectedRow : number;
    labels: any[];

  constructor(private apiService: ApiService) {
    this.apiService.getLabels().subscribe(labels => this.labels = labels);
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
    for(i=0; i<this.labels.length;i++){
      if(this.labels[i].Id==id){
        this.selectedRow = i;
      }
    }
    this.labelsGridClicked.emit(id);
  }

}
