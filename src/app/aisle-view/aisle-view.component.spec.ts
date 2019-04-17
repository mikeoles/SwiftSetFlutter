import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AisleViewComponent } from './aisle-view.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductGridComponent } from './product-details/product-grid/product-grid.component';
import { SelectionAreaComponent } from './selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';
import Mission from '../mission.model';
import Aisle from '../aisle.model';
import { of } from 'rxjs';
import Label from '../label.model';
import { By } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Component, Input } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EnvironmentService } from '../environment.service';

@Component({selector: 'app-export-modal', template: ''})
class ModalComponent {
  @Input() id: string;
}

describe('AisleViewComponent', () => {
  let fixture: ComponentFixture<AisleViewComponent>;
  let component: AisleViewComponent;
  let apiService: jasmine.SpyObj<ApiService>;

  const missions: Mission[] = [
    { missionId: 1, missionName: '1111', storeId: 1, createDateTime: new Date('2018-12-12'), missionDateTime: new Date('2018-12-12') },
    { missionId: 2, missionName: '2222', storeId: 1, createDateTime: new Date('2001-01-01'), missionDateTime: new Date('2001-01-01') },
  ];
  const labels: Label[] = [
    { labelId: 1, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      topMeters: 0, leftMeters: 0, widthMeters: 0, heightMeters: 0 }, department: '', section: '', customFields: [], onHand: 0 },
    { labelId: 2, labelName: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0,
      height: 0, topMeters: 0, leftMeters: 0, widthMeters: 0, heightMeters: 0 }, department: '', section: '', customFields: [], onHand: 0 },
    { labelId: 3, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      topMeters: 0, leftMeters: 0, widthMeters: 0, heightMeters: 0 }, department: '', section: '', customFields: [], onHand: 0 },
    { labelId: 4, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      topMeters: 0, leftMeters: 0, widthMeters: 0, heightMeters: 0 }, department: '', section: '', customFields: [], onHand: 0 },
    { labelId: 5, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      topMeters: 0, leftMeters: 0, widthMeters: 0, heightMeters: 0 }, department: '', section: '', customFields: [], onHand: 0 },
  ];
  const aisles: Aisle[] = [
    { aisleId: 1, aisleName: '1111', panoramaUrl: '', labels: labels, outs: labels, spreads: [], zone: '',
      coveragePercent: 0, outsCount: 0, labelsCount: 0 },
    { aisleId: 2, aisleName: '2222', panoramaUrl: '', labels: labels, outs: labels, spreads: [], zone: '',
      coveragePercent: 0, outsCount: 0, labelsCount: 0  },
    { aisleId: 3, aisleName: '3333', panoramaUrl: '', labels: labels, outs: labels, spreads: [], zone: '',
      coveragePercent: 0, outsCount: 0, labelsCount: 0  },
    { aisleId: 4, aisleName: '4444', panoramaUrl: '', labels: labels, outs: labels, spreads: [], zone: '',
      coveragePercent: 0, outsCount: 0, labelsCount: 0  },
    { aisleId: 5, aisleName: '5555', panoramaUrl: '', labels: labels, outs: labels, spreads: [], zone: '',
      coveragePercent: 0, outsCount: 0, labelsCount: 0  },
  ];


  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getMissions', 'getAisles', 'getAisle']);
    const locationSpy = jasmine.createSpyObj('Location', ['replaceState']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        FontAwesomeModule,
        HttpClientModule,
        NgMultiSelectDropDownModule.forRoot(),
      ],
      declarations: [
        AisleViewComponent,
        PanoramaComponent,
        ProductDetailsComponent,
        ProductGridComponent,
        SelectionAreaComponent,
        ModalComponent,
      ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy },
        { provide: ModalService},
        { provide: Router },
        { provide: Location, useValue:  locationSpy},
        { provide: ActivatedRoute, useValue: {
          params: [{
            missionId: '1',
            aisleId: '1',
            storeId: '1',
          }],
        }},
        { provide: EnvironmentService, useValue: { config: {
          showPlugs: true,
          showSuppliers: true,
          productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price']
        }}}
      ],
    }).compileComponents();

    apiService = TestBed.get('ApiService');
    apiService.getMissions.and.returnValue(of(missions));
    apiService.getAisles.and.returnValue(of(aisles));
    apiService.getAisle.and.returnValue(of(aisles[0]));

    fixture = TestBed.createComponent(AisleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'aisle'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('aisle');
  });

  it('should load the missions', () => {
    expect(fixture.componentInstance.missions).toEqual([missions[0]]);
  });

  it('should load the aisles', () => {
    expect(fixture.componentInstance.aisles).toEqual(aisles);
  });

  it('should load the outs and labels', () => {
    expect(fixture.componentInstance.outs).toEqual(labels);
    expect(fixture.componentInstance.labels).toEqual(labels);
  });

  it('should select the first mission and aisle', () => {
    expect(fixture.componentInstance.selectedMission).toEqual(missions[0]);
    expect(fixture.componentInstance.selectedAisle).toEqual(aisles[0]);
  });

  it('should set the selection area component', () => {
    const selectionAreaDe = fixture.debugElement.query(By.directive(SelectionAreaComponent));
    expect(selectionAreaDe.componentInstance.missions).toEqual([missions[0]]);
    expect(selectionAreaDe.componentInstance.aisles).toEqual(aisles);
    expect(selectionAreaDe.componentInstance.selectedMission).toEqual(component.selectedMission);
    expect(selectionAreaDe.componentInstance.selectedAisle).toEqual(component.selectedAisle);
  });

  it('should set the panorama component', () => {
    const panoramaDe = fixture.debugElement.query(By.directive(PanoramaComponent));
    expect(panoramaDe.componentInstance.outs).toEqual(component.selectedAisle.outs);
    expect(panoramaDe.componentInstance.labels).toEqual(component.selectedAisle.labels);
    expect(panoramaDe.componentInstance.panoramaUrl).toEqual(component.selectedAisle.panoramaUrl);
    expect(panoramaDe.componentInstance.currentId).toEqual(component.currentId);
    expect(panoramaDe.componentInstance.currentDisplay).toEqual(component.currentDisplay);
  });

  it('should set the product details component', () => {
    const productDetailsDe = fixture.debugElement.query(By.directive(ProductDetailsComponent));
    expect(productDetailsDe.componentInstance.outs).toEqual(component.selectedAisle.outs);
    expect(productDetailsDe.componentInstance.labels).toEqual(component.selectedAisle.labels);
    expect(productDetailsDe.componentInstance.currentId).toEqual(component.currentId);
    expect(productDetailsDe.componentInstance.currentDisplay).toEqual(component.currentDisplay);
  });
});
