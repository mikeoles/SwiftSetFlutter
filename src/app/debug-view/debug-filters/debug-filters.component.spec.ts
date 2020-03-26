import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugFiltersComponent } from './debug-filters.component';

describe('DebugFiltersComponent', () => {
  let component: DebugFiltersComponent;
  let fixture: ComponentFixture<DebugFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
