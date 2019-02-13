import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGraphsComponent } from './daily-graphs.component';
import { ChartsModule } from 'ng2-charts';

describe('DailyGraphsComponent', () => {
  let component: DailyGraphsComponent;
  let fixture: ComponentFixture<DailyGraphsComponent>;
  const data = [
    { dailyAverage: 120, date: new Date() },
    { dailyAverage: 130, date: new Date() },
    { dailyAverage: 140, date: new Date() },
  ];

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
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set barchart data', () => {
    expect(component.barChartData.length).toEqual(data.length);
    for (let i = 0; i < data.length; i++) {
      expect(component.barChartData[i]).toEqual([data[i].dailyAverage]);
    }
  });

  it('should notify when clicked', () => {
    let called = false;

    component.selectedIndex.subscribe(e => {
      called = true;
      expect(e.index).toEqual(1);
      expect(e.date).toEqual(data[1].date);
    });

    component.chartClicked({
      event: { currentTarget: { id: 1 }}
    });
    expect(called).toBeTruthy();
  });
});
