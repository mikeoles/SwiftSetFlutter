import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountGraphComponent } from './count-graph.component';

describe('CountGraphComponent', () => {
  let component: CountGraphComponent;
  let fixture: ComponentFixture<CountGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
