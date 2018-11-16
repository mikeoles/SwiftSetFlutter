import { Component, OnInit, AfterViewChecked, EventEmitter, Output, Input } from '@angular/core';
import Label from 'src/app/label.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewChecked {

  @Output() gridClicked = new EventEmitter();
  @Input() products: Label[];
  @Input() selectedId: number;

  ngOnInit() {}

  ngAfterViewChecked() {
    const row = document.getElementById(`row-${this.selectedId}`);
    if (row) {
      row.scrollIntoView({ behavior: 'instant' });
    }
  }

  setClickedRow(id) {
    this.gridClicked.emit(id);
  }
}
