import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFleetViewComponent } from './customer-fleet-view.component';

describe('CustomerFleetViewComponent', () => {
  let component: CustomerFleetViewComponent;
  let fixture: ComponentFixture<CustomerFleetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFleetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFleetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
