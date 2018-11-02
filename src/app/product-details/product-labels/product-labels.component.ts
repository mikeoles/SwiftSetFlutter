import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-product-labels',
  templateUrl: './product-labels.component.html',
  styleUrls: ['./product-labels.component.scss', '../grid-styles.scss']
})
export class ProductLabelsComponent implements OnInit {

    @Output() labelsGridClicked = new EventEmitter();
    @Input() labels: any[];
    @Input() selectedId: number;

  ngOnInit() {
  }

  setClickedRow(id) {
    this.labelsGridClicked.emit(id);
  }
}
