import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonSelectionAreaComponent } from './comparison-selection-area.component';

describe('ComparisonSelectionAreaComponent', () => {
  let component: ComparisonSelectionAreaComponent;
  let fixture: ComponentFixture<ComparisonSelectionAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonSelectionAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonSelectionAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
