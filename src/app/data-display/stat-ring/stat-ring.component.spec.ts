import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatRingComponent } from './stat-ring.component';

describe('StatRingComponent', () => {
  let component: StatRingComponent;
  let fixture: ComponentFixture<StatRingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatRingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatRingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
