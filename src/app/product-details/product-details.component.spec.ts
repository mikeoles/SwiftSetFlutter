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
});
