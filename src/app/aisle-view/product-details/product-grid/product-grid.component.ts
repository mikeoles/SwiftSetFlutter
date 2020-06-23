import { Component, OnInit, AfterViewChecked, EventEmitter, Output, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import Label from 'src/app/models/label.model';
import { labelScrollOptions } from 'src/app/aisle-view/product-details/product-grid/labelScrollOptions';
import { EnvironmentService } from '../../../services/environment.service';
import Annotation from 'src/app/models/annotation.model';
import { Role } from 'src/app/auth/role';
import { AuthService } from 'src/app/auth/auth.service';

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

  @Input() labelToAnnotation = new Map<string, string>();
  @Input() allLabels: Array<Label>;
  @Input() selectedId: string;

  @Output() gridClicked = new EventEmitter<string>();

  columnHeaders: String[];
  rows: Array<Array<String>> = [];

  constructor(private environment: EnvironmentService, private authService: AuthService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.allLabels || !(changes['allLabels'])) {
      return;
    }

    if (changes['allLabels']) {
      if (this.allLabels.length > -1) {
        this.sortProductsByLocation();
        this.getGridData();
      }
    }
  }

  sortProductsByLocation() {
    if (this.environment.config.labelScrolling === labelScrollOptions.horizontal) {
      this.allLabels.sort(this.horizontal);
      return;
    }
    if (this.environment.config.labelScrolling === labelScrollOptions.vertical) {
      this.allLabels.sort(this.horizontal);
    } else {
      this.allLabels.sort(this.vertical);
    }

    let sortedLabels: Label[] = [];
    let currentLabel = this.allLabels[0];
    let currentRow: Label[] = [];
    let nextLabel = currentLabel;
    currentRow.push(currentLabel);

    for (let i = 1; i < this.allLabels.length - 1; i++) {
      nextLabel = this.allLabels[i];
      if (this.isSameLevel(currentLabel, nextLabel)) {
        if (this.environment.config.labelScrolling === labelScrollOptions.vertical) {
          currentRow.sort(this.vertical);
        } else {
          currentRow.sort(this.horizontal);
        }
        sortedLabels = sortedLabels.concat(currentRow);
        currentRow = [];
        currentRow.push(nextLabel);
      } else {
        currentRow.push(nextLabel);
      }
      currentLabel = nextLabel;
    }

    if (this.allLabels.length > 1) {
      currentRow.push(this.allLabels[this.allLabels.length - 1]);
    }

    if (this.environment.config.labelScrolling === labelScrollOptions.vertical) {
      currentRow.sort(this.vertical);
    } else {
      currentRow.sort(this.horizontal);
    }

    sortedLabels = sortedLabels.concat(currentRow);
    if (this.allLabels.length > 0) {
      this.allLabels = sortedLabels;
    }
  }

  getGridData() {
    this.rows = [];
    this.columnHeaders = Object.assign([], this.environment.config.productGridFields);
    if (this.authService.hasRole(Role.AUDITOR) || this.authService.hasRole(Role.AUDIT_MANAGER)) {
      this.columnHeaders.push('QA Annotations');
    }

    for (let i = 0; i < this.allLabels.length; i++) {
      const label: Label = this.allLabels[i];
      let row: Array<String> = Array<String>();
      for (let j = 0; j < this.columnHeaders.length; j++) {
        this.columnHeaders[j] = this.columnHeaders[j].replace(/(^")|("$)/g, '');
        const field: String = this.columnHeaders[j];
        let fieldLowercase = field.charAt(0).toLowerCase() + field.slice(1);
        fieldLowercase = fieldLowercase.replace(/\s/g, ''); // remove spaces and make first letter lowercase
        let cellValue: any = '';
        if (fieldLowercase === 'qAAnnotations') { // check the label for annotations and display the first one in the grid
          cellValue = this.labelToAnnotation.get(label.labelId);
        } else if (fieldLowercase === 'description') {
          fieldLowercase = 'labelName';
        }
        if (fieldLowercase === 'price' && (label.price === 0 || label.price)) {
          cellValue = `$${label.price.toFixed(2)}`;
        }

        if (label[fieldLowercase]) {
          cellValue = label[fieldLowercase];
        } else if (label.bounds[fieldLowercase]) {
          cellValue = label.bounds[fieldLowercase];
        } else {
          for (let k = 0; k < label.customFields.length; k++) {
            if (label.customFields[k].name === field || label.customFields[k].name === '"' + field + '"') {
              cellValue = label.customFields[k].value;
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
  isSameLevel(currentLabel: Label, nextLabel: Label) {
    if (this.environment.config.labelScrolling === labelScrollOptions.horizontal
      && currentLabel.bounds.top + currentLabel.bounds.height < nextLabel.bounds.top) {
      return true;
    }
    if (this.environment.config.labelScrolling === labelScrollOptions.vertical
      && currentLabel.bounds.left + currentLabel.bounds.width < nextLabel.bounds.left) {
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
    if (event.keyCode === KEY_CODE.UP && this.selectedId && this.selectedId !== '-1') {
      const index = this.findIndexById(this.selectedId);
      if (index > 0) {
        this.gridClicked.emit( this.allLabels[index - 1].labelId);
      }
    } else if (event.keyCode === KEY_CODE.DOWN && this.selectedId && this.selectedId !== '-1') {
      const index = this.findIndexById(this.selectedId);
      if (index < (this.allLabels.length - 1)) {
        this.gridClicked.emit( this.allLabels[index + 1].labelId );
      }
    }
  }

  // Return the table index based on a product id
  findIndexById(id: string) {
    for (let i = 0; i < this.allLabels.length; i++) {
      if (this.allLabels[i].labelId === id) {
        return i;
      }
    }
  }
}
