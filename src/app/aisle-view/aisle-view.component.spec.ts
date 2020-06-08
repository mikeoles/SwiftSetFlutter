import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AisleViewComponent } from './aisle-view.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductGridComponent } from './product-details/product-grid/product-grid.component';
import { SelectionAreaComponent } from './selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Mission from '../models/mission.model';
import Aisle from '../models/aisle.model';
import { of } from 'rxjs';
import Label from '../models/label.model';
import { By } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Component, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EnvironmentService } from '../services/environment.service';
import Store from '../models/store.model';


@Component({selector: 'app-export-modal', template: ''})
class ModalComponent {
  @Input() id: string;
}

describe('AisleViewComponent', () => {
  let fixture: ComponentFixture<AisleViewComponent>;
  let component: AisleViewComponent;
  let apiService: jasmine.SpyObj<ApiService>;
  let environmentService: jasmine.SpyObj<EnvironmentService>;
  const labels: Label[] = [
    { labelId: '1', labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0,
    bounds: { top: 0, left: 0, width: 0, height: 0}, department: '', section: '', customFields: [], onHand: 0, color: '' },
    { labelId: '2', labelName: 'label name', barcode: '55037', productId: '12345', price: 0.0,
    bounds: { top: 0, left: 0, width: 0, height: 0 }, department: '', section: '', customFields: [], onHand: 0, color: '' }
  ];

  const aisles: Aisle[] = [
    { aisleId: '1', aisleName: '1111', panoramaUrl: '', createDateTime: new Date(), scanDateTime: new Date(),
      labels: labels, outs: labels, sectionLabels: labels, sectionBreaks: [], topStock: labels,
      outsCount: 0, labelsCount: 0, auditQueueStatus: null,
      previouslySeenBarcodeCount: 0, previouslySeenBarcodeSampleSize: 0, missingPreviouslySeenBarcodeCount: 0,
      missingPreviouslySeenBarcodePercentage: 0, missingPreviouslySeenBarcodes: [], },
      { aisleId: '5', aisleName: '2222', panoramaUrl: '', createDateTime: new Date(), scanDateTime: new Date(),
      labels: labels, outs: labels, sectionLabels: labels, sectionBreaks: [], topStock: labels,
      outsCount: 0, labelsCount: 0, auditQueueStatus: null,
      previouslySeenBarcodeCount: 0, previouslySeenBarcodeSampleSize: 0, missingPreviouslySeenBarcodeCount: 0,
      missingPreviouslySeenBarcodePercentage: 0, missingPreviouslySeenBarcodes: [] },
      { aisleId: '5', aisleName: '3333', panoramaUrl: '', createDateTime: new Date(), scanDateTime: new Date(),
      labels: labels, outs: labels, sectionLabels: labels, sectionBreaks: [], topStock: labels,
      outsCount: 0, labelsCount: 0, auditQueueStatus: null,
      previouslySeenBarcodeCount: 0, previouslySeenBarcodeSampleSize: 0, missingPreviouslySeenBarcodeCount: 0,
      missingPreviouslySeenBarcodePercentage: 0, missingPreviouslySeenBarcodes: [] },
      { aisleId: '5', aisleName: '4444', panoramaUrl: '', createDateTime: new Date(), scanDateTime: new Date(),
      labels: labels, outs: labels, sectionLabels: labels, sectionBreaks: [], topStock: labels,
      outsCount: 0, labelsCount: 0, auditQueueStatus: null,
      previouslySeenBarcodeCount: 0, previouslySeenBarcodeSampleSize: 0, missingPreviouslySeenBarcodeCount: 0,
      missingPreviouslySeenBarcodePercentage: 0, missingPreviouslySeenBarcodes: [] },
      { aisleId: '5', aisleName: '5555', panoramaUrl: '', createDateTime: new Date(), scanDateTime: new Date(),
      labels: labels, outs: labels, sectionLabels: labels, sectionBreaks: [], topStock: labels,
      outsCount: 0, labelsCount: 0, auditQueueStatus: null,
      previouslySeenBarcodeCount: 0, previouslySeenBarcodeSampleSize: 0, missingPreviouslySeenBarcodeCount: 0,
      missingPreviouslySeenBarcodePercentage: 0, missingPreviouslySeenBarcodes: [] },
  ];

  const mission: Mission = { missionId: '1', missionName: '1111', storeId: '1', createDateTime: new Date('2018-12-12'),
    startDateTime: new Date('2018-12-12'), endDateTime: new Date('2018-12-12'), aisleCount: 0, outs: 0, labels: 0,
    readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0, unreadLabels: 0, percentageRead: 0, percentageUnread: 0,
    aisles: aisles, storeName: '', storeNumber: 1 };

  const missions: Mission[] = [
    { missionId: '1', missionName: '1111', storeId: '1', createDateTime: new Date('2018-12-12'), startDateTime: new Date('2018-12-12'),
      endDateTime: new Date('2018-12-12'), aisleCount: 0, outs: 0, labels: 0, readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0,
      unreadLabels: 0, percentageRead: 0, percentageUnread: 0, aisles: aisles, storeName: '', storeNumber: 1 },
    { missionId: '2', missionName: '2222', storeId: '1', createDateTime: new Date('2001-01-01'), startDateTime: new Date('2001-01-01'),
      endDateTime: new Date('2018-12-13'), aisleCount: 0, outs: 0, labels: 0, readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0,
      unreadLabels: 0, percentageRead: 0, percentageUnread: 0, aisles: aisles, storeName: '', storeNumber: 1 },
  ];

  const store: Store = {  storeId: '',
  storeNumber: 1,
  robots: [],
  canary: false,
  storeName: '',
  storeAddress: '',
  totalAverageOuts: 1,
  totalAverageLabels: 1,
  summaryOuts: [],
  summaryLabels: [],
  zoneId: ''
};

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getMissions', 'getMission', 'getAisle', 'getStore',
    'getMisreadCategories', 'getUndetectedLabelsCategories', 'getFalseNegativeCategories', 'getFalsePositiveCategories']);
    const locationSpy = jasmine.createSpyObj('Location', ['replaceState', 'go']);
    const environmentServiceSpy = jasmine.createSpyObj('EnvironmentService', ['setPermissions']);

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
        { provide: EnvironmentService, useValue: environmentServiceSpy },
        { provide: ModalService},
        { provide: Router },
        { provide: Location, useValue:  locationSpy},
        { provide: Router, useValue: { url: '' }},
        { provide: ActivatedRoute, useValue: {
          params: [{
            missionId: '1',
            aisleId: '1',
            storeId: '1',
          }],
          snapshot: {
            queryParams: '1'
          }
        }},
        { provide: EnvironmentService, useValue: { config: {
          productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price'],
          permissions: ['topStock', 'QA', 'sectionLabels', 'sectionBreaks', 'misreadBarcodes']
        }}},
      ],
    }).compileComponents();

    environmentService = TestBed.get(EnvironmentService);
    apiService = TestBed.get('ApiService');
    apiService.getMission.and.returnValue(of(mission));
    apiService.getMissions.and.returnValue(of(missions));
    apiService.getAisle.and.returnValue(of(aisles[0]));
    apiService.getStore.and.returnValue(of(store));
    apiService.getMisreadCategories.and.returnValues(of([]));
    apiService.getUndetectedLabelsCategories.and.returnValues(of([]));
    apiService.getFalseNegativeCategories.and.returnValues(of([]));
    apiService.getFalsePositiveCategories.and.returnValues(of([]));
    fixture = TestBed.createComponent(AisleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should load the missions', () => {
    expect(fixture.componentInstance.missions).toEqual(missions);
  });

  it('should load the aisles', () => {
    expect(fixture.componentInstance.selectedMission.aisles).toEqual(aisles);
  });

  it('should load the outs and labels', () => {
    expect(fixture.componentInstance.labels).toEqual(labels);
  });

  it('should select the first mission and aisle', () => {
    expect(fixture.componentInstance.selectedMission).toEqual(missions[0]);
    expect(fixture.componentInstance.selectedAisle).toEqual(aisles[0]);
  });

  it('should set the selection area component', () => {
    const selectionAreaDe = fixture.debugElement.query(By.directive(SelectionAreaComponent));
    expect(selectionAreaDe.componentInstance.missions).toEqual(missions);
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
  });

  it('should set the product details component', () => {
    const productDetailsDe = fixture.debugElement.query(By.directive(ProductDetailsComponent));
    expect(productDetailsDe.componentInstance.outs).toEqual(component.selectedAisle.outs);
    expect(productDetailsDe.componentInstance.labels).toEqual(component.selectedAisle.labels);
    expect(productDetailsDe.componentInstance.currentId).toEqual(component.currentId);
  });
});
