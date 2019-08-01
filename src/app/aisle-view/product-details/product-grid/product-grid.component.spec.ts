import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductGridComponent } from './product-grid.component';
import { By } from '@angular/platform-browser';
import Label from 'src/app/label.model';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { EnvironmentService } from 'src/app/environment.service';

describe('ProductGridComponent', () => {
  let component: ProductGridComponent;
  let fixture: ComponentFixture<ProductGridComponent>;
  let secondRowEl: HTMLElement;
  let gridEl: HTMLElement;
  const labels: Label[] = [
    { labelId: 1, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      }, department: '', section: '', customFields: [], onHand: 0},
    { labelId: 2, labelName: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0,
      height: 0, }, department: '', section: '', customFields: [], onHand: 0},
    { labelId: 3, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      }, department: '', section: '', customFields: [], onHand: 0},
    { labelId: 4, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      }, department: '', section: '', customFields: [], onHand: 0},
    { labelId: 5, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0,
      }, department: '', section: '', customFields: [], onHand: 0},
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGridComponent ],
      providers: [
        { provide: EnvironmentService, useValue: { config: {
          productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price']
        }}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGridComponent);
    component = fixture.componentInstance;
    component.products = labels;
    const changesObj: SimpleChanges = {
      products: new SimpleChange([], labels, false)
    };
    component.ngOnChanges(changesObj);
    fixture.detectChanges();
    spyOn(component.gridClicked, 'emit');
    secondRowEl = fixture.debugElement.query(By.css('div > table > tbody > tr:nth-child(2)')).nativeElement;
    gridEl = fixture.debugElement.query(By.css('div > table > tbody')).nativeElement;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits id when row is clicked', () => {
    secondRowEl.click();
    expect(component.gridClicked.emit).toHaveBeenCalledWith(2);
  });

  it('highlights row when clicked', () => {
    component.selectedId = 2;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')).toEqual('selected');
  });

  it('doesn\'t highlight when different row when clicked', () => {
    component.selectedId = 1;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class') === 'selected').toBeFalsy();
  });

  it('doesn\'t highlight when no row is selected', () => {
    component.selectedId = 2;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')).toEqual('selected');

    component.selectedId = -1;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class') === 'selected').toBeFalsy();
  });

  it('displays correct number of rows', () => {
    expect(gridEl.childElementCount).toEqual(5);
  });

  it('displays correct number of columns', () => {
    expect(secondRowEl.childElementCount).toEqual(4);
  });

  it('displays outs data', () => {
    expect(secondRowEl.innerHTML.includes('550376332')).toBeTruthy();
  });

});
