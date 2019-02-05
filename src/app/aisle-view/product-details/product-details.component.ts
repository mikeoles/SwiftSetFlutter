import { environment } from '../../../environments/environment';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import Label from '../../label.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit, OnChanges {

  showPlugs: Boolean;
  showSuppliers: Boolean;
  showDepartment: Boolean;
  showZone: Boolean;
  showSection: Boolean;

  departmentsList: string[] = [];
  zonesList: string[] = [];
  sectionsList: string[] = [];

  selectedDepts: string[] = [];
  selectedZones: string[] = [];
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

  constructor() {
    this.showPlugs = environment.showPlugs;
    this.showSuppliers = environment.showSuppliers;
    this.showDepartment = environment.departments;
    this.showZone = environment.zones;
    this.showSection = environment.sections;
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
        tempSet.add(label.department.toString());
      });
      this.departmentsList = Array.from(tempSet);

      tempSet.clear();
      this.labels.forEach(label => {
        tempSet.add(label.zone.toString());
      });
      this.zonesList = Array.from(tempSet);

      tempSet.clear();
      this.labels.forEach(label => {
        tempSet.add(label.section.toString());
      });
      this.sectionsList = Array.from(tempSet);
    }

    if (this.outs || this.labels) {
      this.runFilters();
    }
  }

  runFilters() {
    if (this.selectedDepts.length + this.selectedSects.length + this.selectedZones.length >= 1) {
      this.filteredLabels = [];
      this.filteredOuts = [];

      const selectedDepts = this.selectedDepts.length > 0 ? new Set<string>(this.selectedDepts) : new Set<string>(this.departmentsList);
      const selectedZones = this.selectedZones.length > 0 ? new Set<string>(this.selectedZones) : new Set<string>(this.zonesList);
      const selectedSects = this.selectedSects.length > 0 ? new Set<string>(this.selectedSects) : new Set<string>(this.sectionsList);

      this.labels.forEach(label => {
        if (selectedDepts.has(label.department) && selectedZones.has(label.zone) && selectedSects.has(label.section)) {
          this.filteredLabels.push(label);
        }
      });

      this.outs.forEach(out => {
        if (selectedDepts.has(out.department) && selectedZones.has(out.zone) && selectedSects.has(out.section)) {
          this.filteredLabels.push(out);
        }
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
