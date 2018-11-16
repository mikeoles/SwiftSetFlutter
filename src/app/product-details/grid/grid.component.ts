import { Component, OnInit, AfterViewChecked, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewChecked {

  @Output() gridClicked = new EventEmitter();
  @Input() products: any[];
  @Input() selectedId: number;

  ngOnInit() {}

  ngAfterViewChecked() {
    const row = document.getElementById(`row-${this.selectedId}`);
    if (row != null) {
      row.scrollIntoView({ behavior: 'instant' });
    }
  }

  setClickedRow(id) {
    this.gridClicked.emit(id);
  }
}
