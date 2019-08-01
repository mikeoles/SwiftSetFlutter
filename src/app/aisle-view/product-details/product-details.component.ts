import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import Label from '../../label.model';
import { EnvironmentService } from 'src/app/environment.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit, OnChanges {

  showDepartment: Boolean;
  showSection: Boolean;

  departmentsList: string[] = [];
  sectionsList: string[] = [];

  selectedDepts: string[] = [];
  selectedSects: string[] = [];

  dropdownSettings = {};
  @Output() gridId = new EventEmitter();
  @Output() gridDisplay = new EventEmitter();
  @Input() outs: Label[] = [];
  filteredOuts: Label[] = [];
  @Input() labels: Label[] = [];
  filteredLabels: Label[] = [];
  @Input() currentId: number;
  @Input() currentDisplay: string;
  @Input() panoMode: boolean;

  constructor(private environment: EnvironmentService) {
    this.showDepartment = environment.config.productGridFields.includes('Department');
    this.showSection = environment.config.productGridFields.includes('Section');
  }


  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 1,
    };
  }

  ngOnChanges() {
    if (this.labels) {
      const tempSet: Set<string> = new Set<string>();
      this.labels.forEach(label => {
        label.customFields.forEach(field => {
          if (field.name === 'Department') {
            tempSet.add(field.value);
          }
        });
      });
      this.departmentsList = Array.from(tempSet);

      tempSet.clear();
      this.labels.forEach(label => {
        if (label.section != null) {
          tempSet.add(label.section);
        }
      });
      this.sectionsList = Array.from(tempSet);
    }

    if (this.outs || this.labels) {
      this.runFilters();
    }
  }

  runFilters() {
    if (this.selectedDepts.length + this.selectedSects.length  >= 1) {
      this.filteredLabels = [];
      this.filteredOuts = [];

      const selectedDepts = this.selectedDepts.length > 0 ? new Set<string>(this.selectedDepts) : new Set<string>(this.departmentsList);
      const selectedSects = this.selectedSects.length > 0 ? new Set<string>(this.selectedSects) : new Set<string>(this.sectionsList);

      this.labels.forEach(label => {
        label.customFields.forEach(field => {
          if (field.name === 'Department') {
            if (selectedDepts.has(field.value) && selectedSects.has(label.section)) {
              this.filteredLabels.push(label);
            }
          }
        });
      });

      this.outs.forEach(out => {
        out.customFields.forEach(field => {
          if (field.name === 'Department') {
            if (selectedDepts.has(field.value) && selectedSects.has(out.section)) {
              this.filteredLabels.push(out);
            }
          }
        });
      });
    } else {
      this.filteredLabels = this.labels;
      this.filteredOuts = this.outs;
    }

  }

  // Called when the user clicks one of the buttons to change tables
  selectGrid(type) {
    this.gridDisplay.emit(type);
    this.gridId.emit(-1);    // Emit -1 to signal that no elements are selected
  }

  // Called when the user clicks on one of the rows in the table
  productGridSelected(id) {
    if (id === this.currentId) {
      this.gridId.emit(-1);
    } else {
      this.gridId.emit(id);
    }
  }
}
