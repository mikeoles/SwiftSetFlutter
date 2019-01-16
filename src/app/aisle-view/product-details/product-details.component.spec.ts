import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { GridComponent } from './grid/grid.component';
import { By } from '@angular/platform-browser';
import Label from '../../label.model';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let buttonsEl: HTMLElement;
  let buttons: HTMLCollection;
  const labels: Label[] = [
    { id: 1, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 2, name: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 3, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 4, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 5, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
  ];
  const outs: Label[] = [
    { id: 6, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 7, name: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 8, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 9, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 10, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductDetailsComponent,
        GridComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    component.showPlugs = true;
    component.showSuppliers = true;
    component.labels = labels;
    component.outs = outs;
    fixture.detectChanges();
    buttonsEl = fixture.debugElement.query(By.css('#tableSelection')).nativeElement;
    buttons = buttonsEl.children;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit display type', () => {
    spyOn(component.gridDisplay, 'emit');
    component.selectGrid('outs');
    fixture.detectChanges();
    expect(component.gridDisplay.emit).toHaveBeenCalledWith('outs');
 });

  it('should emit -1 ID when display type clicked', () => {
    spyOn(component.gridId, 'emit');
    // Send any string to selected grid
    component.selectGrid('labels');
    fixture.detectChanges();
    expect(component.gridId.emit).toHaveBeenCalledWith(-1);
  });

  it('should emit ID when a new row is clicked', () => {
    component.currentId = 1;
    spyOn(component.gridId, 'emit');
    component.productGridSelected(0);
    fixture.detectChanges();
    expect(component.gridId.emit).toHaveBeenCalledWith(0);
  });

  it('should emit ID when a row is clicked and no row is selected', () => {
    spyOn(component.gridId, 'emit');
    component.productGridSelected(3);
    fixture.detectChanges();
    expect(component.gridId.emit).toHaveBeenCalledWith(3);
  });

  it('should emit -1 ID when selected row is clicked again', () => {
    component.currentId = 2;
    spyOn(component.gridId, 'emit');
    component.productGridSelected(2);
    fixture.detectChanges();
    expect(component.gridId.emit).toHaveBeenCalledWith(-1);
  });

  it('displays buttons', () => {
    expect(buttonsEl.childElementCount).toEqual(4);
    expect(buttons[0].textContent).toContain('Outs');
    expect(buttons[1].textContent).toContain('Shelf Labels');
    expect(buttons[2].textContent).toContain('Spreads');
    expect(buttons[3].textContent).toContain('Suppliers');
  });

  it('displays counts on buttons', () => {
    expect(buttons[0].textContent).toContain('(5)');
    expect(buttons[1].textContent).toContain('(5)');
  });

  it('can hide plugs', () => {
    component.showPlugs = false;
    fixture.detectChanges();
    buttons = buttonsEl.children;
    expect(buttonsEl.childElementCount).toEqual(3);
    expect(buttons[2].textContent).toEqual('Suppliers');
  });

  it('can hide suppliers', () => {
    component.showSuppliers = false;
    fixture.detectChanges();
    buttons = buttonsEl.children;
    expect(buttonsEl.childElementCount).toEqual(3);
    expect(buttons[2].textContent).toEqual('Spreads');
  });

  it('can hide plugs and suppliers', () => {
    component.showPlugs = false;
    component.showSuppliers = false;
    fixture.detectChanges();
    buttons = buttonsEl.children;
    expect(buttonsEl.childElementCount).toEqual(2);
  });

  it('button can be selected', () => {
    component.currentDisplay = 'labels';
    fixture.detectChanges();
    buttons = buttonsEl.children;
    expect(buttons[0].getAttribute('class') === 'selectedButton').toBeFalsy();
    expect(buttons[1].getAttribute('class')).toEqual('selectedButton');
  });
});
