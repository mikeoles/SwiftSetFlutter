import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { GridComponent } from './product-details/grid/grid.component';
import { SelectionAreaComponent } from './selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        FontAwesomeModule,
        HttpClientModule,
      ],
      declarations: [
        AppComponent,
        PanoramaComponent,
        ProductDetailsComponent,
        GridComponent,
        SelectionAreaComponent,
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
