import { Component, OnInit, AfterViewChecked, EventEmitter, Output, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import Label from 'src/app/label.model';
import { labelScrollOptions } from 'src/app/labelScrollOptions';
import { EnvironmentService } from 'src/app/environment.service';

export enum KEY_CODE {
  UP = 38,
  DOWN = 40
}

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent implements OnInit, AfterViewChecked, OnChanges {

  @Output() gridClicked = new EventEmitter();
  @Input() products: Label[];
  @Input() onlyBarcode: boolean; // Displays only the barcode in the grid, used for top stock and shelf labels
  @Input() annotationTypes: string[];
  @Input() selectedId: number;
  showDepartment: Boolean;
  showSection: Boolean;
  columnHeaders: String[];
  rows: Array<Array<String>> = [];

  constructor(private environment: EnvironmentService) {
    // this.showDepartment = this.environment.config.productGridFields.includes('Department');
    // this.showSection = this.environment.config.productGridFields.includes('Section');
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.products || !changes['products']) {
      return;
    }

    if (changes['products']) {
      if (this.products.length > 0) {
        this.sortProductsByLocation();
      }
      this.getGridData();
    }
  }

  sortProductsByLocation() {
    if (this.environment.config.labelScrolling === labelScrollOptions.horizontal) {
      this.products.sort(this.horizontal);
      return;
    }
    if (this.environment.config.labelScrolling === labelScrollOptions.vertical) {
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
        if (this.environment.config.labelScrolling === labelScrollOptions.vertical) {
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

    if (this.environment.config.labelScrolling === labelScrollOptions.vertical) {
      currentRow.sort(this.vertical);
    } else {
      currentRow.sort(this.horizontal);
    }

    sortedProducts = sortedProducts.concat(currentRow);
    this.products = sortedProducts;
  }

  getGridData() {
    this.rows = [];
    if (this.onlyBarcode) {
      this.columnHeaders = ['Barcode'];
    } else {
      this.columnHeaders = ['Label Name', 'Barcode', 'Product Id', 'Price'];
      // this.columnHeaders = Object.assign([], this.environment.config.productGridFields);
    }

    this.annotationTypes.forEach(annotationType => {
      if (this.annotationTypes && !this.columnHeaders.includes(annotationType)) {
        this.columnHeaders.push(annotationType);
      }
    });

    for (let i = 0; i < this.products.length; i++) {
      const product: Label = this.products[i];
      let row: Array<String> = Array<String>();
      for (let j = 0; j < this.columnHeaders.length; j++) {
        this.columnHeaders[j] = this.columnHeaders[j].replace(/(^")|("$)/g, '');
        const field: String = this.columnHeaders[j];
        let fieldLowercase = field.charAt(0).toLowerCase() + field.slice(1);
        fieldLowercase = fieldLowercase.replace(/\s/g, '');
        if (fieldLowercase === 'description') {
          fieldLowercase = 'labelName';
        }
        let cellValue: any = '';
        if (fieldLowercase === 'price' && (product.price === 0 || product.price)) {
          cellValue = `$${product.price.toFixed(2)}`;
        } else if (product[fieldLowercase]) {
          cellValue = product[fieldLowercase];
        } else if (product.bounds[fieldLowercase]) {
          cellValue = product.bounds[fieldLowercase];
        } else if (product.annotations[fieldLowercase]) {
          cellValue = product.annotations[fieldLowercase];
        } else {
          for (let k = 0; k < product.customFields.length; k++) {
            if (product.customFields[k].name === field || product.customFields[k].name === '"' + field + '"') {
              cellValue = product.customFields[k].value;
            }
          }
        }
        row = row.concat(cellValue);
      }
      this.rows.push(row);
      row = Array<String>();
    }
  }

  // check if labels are on same row or column
  isSameLevel(currentProduct: Label, nextProduct: Label) {
    if (this.environment.config.labelScrolling === labelScrollOptions.horizontal
      && currentProduct.bounds.top + currentProduct.bounds.height < nextProduct.bounds.top) {
      return true;
    }
    if (this.environment.config.labelScrolling === labelScrollOptions.vertical
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
        this.gridClicked.emit( this.products[index - 1].labelId);
      }
    } else if (event.keyCode === KEY_CODE.DOWN && this.selectedId >= 0) {
      const index = this.findIndexById(this.selectedId);
      if (index < (this.products.length - 1)) {
        this.gridClicked.emit( this.products[index + 1].labelId );
      }
    }
  }

  // Return the table index based on a product id
  findIndexById(id: number) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].labelId === id) {
        return i;
      }
    }
  }
}
