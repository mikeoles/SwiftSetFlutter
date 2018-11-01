import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelsComponent } from './product-labels.component';

describe('ProductLabelsComponent', () => {
  let component: ProductLabelsComponent;
  let fixture: ComponentFixture<ProductLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
