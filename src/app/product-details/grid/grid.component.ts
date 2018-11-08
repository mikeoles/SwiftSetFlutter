import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Output() gridClicked = new EventEmitter();
  @Input() products: any[];
  @Input() selectedId: number;

  ngOnInit() {}

  setClickedRow(id) {
    this.gridClicked.emit(id);
  }
}
