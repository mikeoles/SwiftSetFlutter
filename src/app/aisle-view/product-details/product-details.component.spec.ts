import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { By } from '@angular/platform-browser';
import Label from '../../label.model';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { EnvironmentService } from 'src/app/environment.service';
import { of } from 'rxjs';
import { ApiService } from 'src/app/api.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let countsEl: HTMLElement;
  let children: HTMLCollection;
  let apiService: jasmine.SpyObj<ApiService>;
  let environmentService: jasmine.SpyObj<EnvironmentService>;

  const labels: Label[] = [
    { labelId: 1, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: ''},
    { labelId: 2, labelName: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0,
      height: 0}, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: ''},
    { labelId: 3, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: ''},
    { labelId: 4, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: ''},
    { labelId: 5, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: ''},
  ];
  const outs: Label[] = [
    { labelId: 6, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
    { labelId: 7, labelName: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0,
      height: 0 }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
    { labelId: 8, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
    { labelId: 9, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
    { labelId: 10, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0,
      height: 0 }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
  ];
  const topStock: Label[] = [
    { labelId: 6, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
    { labelId: 7, labelName: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0,
      height: 0 }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
    { labelId: 8, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
    { labelId: 9, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0
      }, department: '', section: '', customFields: [], onHand: 0, productCoordinates: [], annotations: [], annotationColor: '' },
  ];

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getRoles']);
    const environmentServiceSpy = jasmine.createSpyObj('EnvironmentService', ['setPermissions']);

    TestBed.configureTestingModule({
      declarations: [
        ProductDetailsComponent,
        ProductGridComponent
      ],
      imports: [
        NgMultiSelectDropDownModule.forRoot(),
        FormsModule
      ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy },
        { provide: EnvironmentService, useValue: { config: {
          productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price'],
          permissions: ['topStock', 'QA', 'sectionLabels', 'sectionBreaks', 'misreadBarcodes']
        }}},
      ]
    })
    .compileComponents();

    environmentService = TestBed.get(EnvironmentService);
    apiService = TestBed.get('ApiService');
    apiService.getRoles.and.returnValue(of('bossanova'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;

    component.labels = labels;
    component.outs = outs;
    component.topStock = topStock;

    fixture.detectChanges();
    countsEl = fixture.debugElement.query(By.css('#tableSelection')).nativeElement;
    children = countsEl.children;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays types of labels', () => {
    expect(countsEl.childElementCount).toEqual(5);
    expect(children[0].textContent).toContain('Outs');
    expect(children[1].textContent).toContain('Shelf Labels');
    expect(children[2].textContent).toContain('Misread Barcodes');
    expect(children[3].textContent).toContain('Section Labels');
    expect(children[4].textContent).toContain('Top Stock');
    expect(children[5].textContent).toContain('Section Breaks');
  });

  it('displays counts', () => {
    expect(children[0].textContent).toContain('5');
    expect(children[1].textContent).toContain('5');
  });
});
