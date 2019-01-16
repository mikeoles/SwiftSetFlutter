import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGraphsComponent } from './daily-graphs.component';
import { ChartsModule } from 'ng2-charts';

describe('DailyGraphsComponent', () => {
  let component: DailyGraphsComponent;
  let fixture: ComponentFixture<DailyGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyGraphsComponent ],
      imports: [ ChartsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyGraphsComponent);
    component = fixture.componentInstance;
    component.data = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
