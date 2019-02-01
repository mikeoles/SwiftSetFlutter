import { Component, OnInit, AfterViewChecked, EventEmitter, Output, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
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
export class GridComponent implements OnInit, AfterViewChecked, OnChanges {

  @Output() gridClicked = new EventEmitter();
  @Input() products: Label[];
  @Input() selectedId: number;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.products) {
      return;
    }

    if (!changes['products'] || this.products.length < 1) {
      return;
    }

    function vertical(a,  b) {
      if (a.bounds.top < b.bounds.top) {
        return -1;
      }
      if (a.bounds.top > b.bounds.top) {
        return 1;
      }
      return 0;
    }

    function horizontal(a,  b) {
      if (a.bounds.left < b.bounds.left) {
        return -1;
      }
      if (a.bounds.left > b.bounds.left) {
        return 1;
      }
      return 0;
    }

    this.products.sort(vertical);

    let sortedProducts: Label[] = [];
    let currentProduct = this.products[0];
    let currentRow: Label[] = [];
    let nextProduct = currentProduct;
    currentRow.push(currentProduct);

    for (let i = 1; i < this.products.length - 1; i++) {
      nextProduct = this.products[i];
      if (currentProduct.bounds.top + currentProduct.bounds.height < nextProduct.bounds.top) {
        currentRow.sort(horizontal);
        sortedProducts = sortedProducts.concat(currentRow);
        currentRow = [];
        currentRow.push(nextProduct);
      } else {
        currentRow.push(nextProduct);
      }
      currentProduct = nextProduct;
    }
    if (this.products.length > 1) {
      currentRow.push(this.products[this.products.length - 1]);
    }
    currentRow.sort(horizontal);
    sortedProducts = sortedProducts.concat(currentRow);
    this.products = sortedProducts;
  }

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

  // Return the table index based on a product id
  findIndexById(id: number) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        return i;
      }
    }
  }
}
