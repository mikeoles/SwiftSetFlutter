import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGraphsComponent } from './daily-graphs.component';

describe('DailyGraphsComponent', () => {
  let component: DailyGraphsComponent;
  let fixture: ComponentFixture<DailyGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
