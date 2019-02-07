import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AisleViewComponent } from './aisle-view.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { GridComponent } from './product-details/grid/grid.component';
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

describe('AisleViewComponent', () => {
  let fixture: ComponentFixture<AisleViewComponent>;
  let component: AisleViewComponent;
  let apiService: jasmine.SpyObj<ApiService>;
  const missions: Mission[] = [
    { id: 1, name: '1111', storeId: '1', createDateTime: new Date('2018-12-12'), missionDateTime: new Date('2018-12-12') },
    { id: 2, name: '2222', storeId: '1', createDateTime: new Date('2001-01-01'), missionDateTime: new Date('2001-01-01') },
  ];
  const labels: Label[] = [
    { id: 1, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 },
    department: '', zone: '', section: '' },
    { id: 2, name: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 },
    department: '', zone: '', section: '' },
    { id: 3, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 },
    department: '', zone: '', section: '' },
    { id: 4, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 },
    department: '', zone: '', section: '' },
    { id: 5, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 },
    department: '', zone: '', section: '' },
  ];
  const aisles: Aisle[] = [
    { id: 1, name: '1111', panoramaUrl: '', labels: labels, outs: labels, spreads: [] },
    { id: 2, name: '2222', panoramaUrl: '', labels: labels, outs: labels, spreads: [] },
    { id: 3, name: '3333', panoramaUrl: '', labels: labels, outs: labels, spreads: [] },
    { id: 4, name: '4444', panoramaUrl: '', labels: labels, outs: labels, spreads: [] },
    { id: 5, name: '5555', panoramaUrl: '', labels: labels, outs: labels, spreads: [] },
  ];


  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getMissions', 'getAisles', 'getAisle']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        FontAwesomeModule,
        HttpClientModule,
        NgMultiSelectDropDownModule.forRoot()
      ],
      declarations: [
        AisleViewComponent,
        PanoramaComponent,
        ProductDetailsComponent,
        GridComponent,
        SelectionAreaComponent,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ],
    }).compileComponents();

    apiService = TestBed.get(ApiService);
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
    expect(fixture.componentInstance.missions).toEqual(missions);
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
