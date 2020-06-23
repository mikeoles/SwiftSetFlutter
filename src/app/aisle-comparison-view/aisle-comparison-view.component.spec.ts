import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AisleComparisonViewComponent } from './aisle-comparison-view.component';

describe('AisleComparisonViewComponent', () => {
  let component: AisleComparisonViewComponent;
  let fixture: ComponentFixture<AisleComparisonViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AisleComparisonViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AisleComparisonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
