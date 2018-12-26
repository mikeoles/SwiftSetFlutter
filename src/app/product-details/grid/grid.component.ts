import { Component, OnInit, AfterViewChecked, EventEmitter, Output, Input, HostListener } from '@angular/core';
import Label from 'src/app/label.model';

export enum KEY_CODE {
  UP = 38,
  DOWN = 40
}

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

  // Change selected row on keyup and keydown
  @HostListener('window:keyup', ['$event'])
  keyscroll(event) {
    if (event.keyCode === KEY_CODE.UP && this.selectedId >= 0) {
      const index = this.findIndexById(this.selectedId);
      if (index > 0) {
        this.gridClicked.emit( this.products[index - 1].id);
      }
    } else if (event.keyCode === KEY_CODE.DOWN && this.selectedId >= 0) {
      const index = this.findIndexById(this.selectedId);
      if (index < (this.products.length - 1)) {
        this.gridClicked.emit( this.products[index + 1].id );
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    event.preventDefault();
  }

  // Return the table index based on a product id
  findIndexById(id: number) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        return i;
      }
    }
  }
}
