import { Component, OnInit, AfterViewChecked, EventEmitter, Output, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';
import Label from 'src/app/label.model';
import { labelScrollOptions } from 'src/app/labelScrollOptions';

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

    if (environment.labelScrolling === labelScrollOptions.vertical) {
      this.products.sort(this.horizontal);
    } else {
      this.products.sort(this.vertical);
    }

    let sortedProducts: Label[] = [];
    let currentProduct = this.products[0];
    let currentRow: Label[] = [];
    let nextProduct = currentProduct;
    currentRow.push(currentProduct);

    for (let i = 1; i < this.products.length - 1; i++) {
      nextProduct = this.products[i];
      if (this.isSameLevel(currentProduct, nextProduct)) {
        if (environment.labelScrolling === labelScrollOptions.vertical) {
          currentRow.sort(this.vertical);
        } else {
          currentRow.sort(this.horizontal);
        }
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

    if (environment.labelScrolling === labelScrollOptions.vertical) {
      currentRow.sort(this.vertical);
    } else {
      currentRow.sort(this.horizontal);
    }

    sortedProducts = sortedProducts.concat(currentRow);
    this.products = sortedProducts;
  }

  // check if labels are on same row or column
  isSameLevel(currentProduct: Label, nextProduct: Label) {
    if (environment.labelScrolling === labelScrollOptions.horizontal
      && currentProduct.bounds.top + currentProduct.bounds.height < nextProduct.bounds.top) {
      return true;
    }
    if (environment.labelScrolling === labelScrollOptions.vertical
      && currentProduct.bounds.left + currentProduct.bounds.width < nextProduct.bounds.left) {
      return true;
    }
    return false;
  }

  // sort labels vertically
  vertical(a,  b) {
    if (a.bounds.top < b.bounds.top) {
      return -1;
    }
    if (a.bounds.top > b.bounds.top) {
      return 1;
    }
    return 0;
  }

  // sort labels horizontally
  horizontal(a,  b) {
    if (a.bounds.left < b.bounds.left) {
      return -1;
    }
    if (a.bounds.left > b.bounds.left) {
      return 1;
    }
    return 0;
  }

  ngAfterViewChecked() {
    const row = document.getElementById(`row-${this.selectedId}`);
    if (row) {
      row.scrollIntoView({ behavior: 'auto' });
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
