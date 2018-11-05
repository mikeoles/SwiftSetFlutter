import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OutsComponent } from './product-details/outs/outs.component';
import { ProductLabelsComponent } from './product-details/product-labels/product-labels.component';
import { PlugsSpreadsComponent } from './product-details/plugs-spreads/plugs-spreads.component';
import { SupplierComponent } from './product-details/supplier/supplier.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PanoramaComponent,
        ProductDetailsComponent,
        OutsComponent,
        ProductLabelsComponent,
        PlugsSpreadsComponent,
        SupplierComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'aisle'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('aisle');
  });
});
