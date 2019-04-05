import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetViewComponent } from './fleet-view.component';

describe('FleetViewComponent', () => {
  let component: FleetViewComponent;
  let fixture: ComponentFixture<FleetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
