import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { OutsComponent } from './outs/outs.component';
import { PlugsSpreadsComponent } from './plugs-spreads/plugs-spreads.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ProductLabelsComponent } from './product-labels/product-labels.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProductDetailsComponent,
        OutsComponent,
        PlugsSpreadsComponent,
        SupplierComponent,
        ProductLabelsComponent 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit display type', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    // spy on event emitter
    const component = fixture.componentInstance; 
    spyOn(component.gridDisplay, 'emit');
    component.selectGrid("outs");
    fixture.detectChanges();
 
    expect(component.gridDisplay.emit).toHaveBeenCalledWith('outs');
 });

  it('should emit -1 ID when display type clicked', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    // spy on event emitter
    const component = fixture.componentInstance; 
    spyOn(component.gridId, 'emit');

    //send any string to selected grid
    component.selectGrid("labels");
    fixture.detectChanges();

    expect(component.gridId.emit).toHaveBeenCalledWith(-1);
  });

  it('should emit ID when a new row is clicked', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    // spy on event emitter
    const component = fixture.componentInstance; 
    component.currentId = 1;
    spyOn(component.gridId, 'emit');

    component.productGridSelected(0);
    fixture.detectChanges();

    expect(component.gridId.emit).toHaveBeenCalledWith(0);
  });
  
  it('should emit ID when a row is clicked and no row is selected', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    // spy on event emitter
    const component = fixture.componentInstance; 
    spyOn(component.gridId, 'emit');

    component.productGridSelected(3);
    fixture.detectChanges();

    expect(component.gridId.emit).toHaveBeenCalledWith(3);
  });

  it('should emit -1 ID when selected row is clicked again', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    // spy on event emitter
    const component = fixture.componentInstance; 
    component.currentId = 2;
    spyOn(component.gridId, 'emit');

    component.productGridSelected(2);
    fixture.detectChanges();

    expect(component.gridId.emit).toHaveBeenCalledWith(-1);
  });
});
