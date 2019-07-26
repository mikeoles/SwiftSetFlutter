import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreViewComponent } from './store-view.component';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import DaySummary from '../daySummary.model';
import Store from '../store.model';
import { NgDatepickerModule } from 'ng2-datepicker';
import { EnvironmentService } from '../environment.service';
import { RouterTestingModule } from '@angular/router/testing';

@Component({selector: 'app-daily-graphs', template: ''})
class AppDailyGraphsStubComponent {
  @Input() data: any[];
  @Input() overallAverage: string;
  @Input() currentIndex: string;
}
@Component({selector: 'app-missions-grid', template: ''})
class AppMissionsGridStubComponent {
  @Input() missionSummaries: any[];
  @Input() missionsDate: any[];
  @Input() averageStoreOuts: number;
  @Input() averageStoreLabels: number;
  @Input() storeId: number;
}

describe('StoreViewComponent', () => {
  let component: StoreViewComponent;
  let fixture: ComponentFixture<StoreViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const missions: MissionSummary[] = [
    { missionId: 1, mission: '', storeId: 1, missionDateTime: new Date(), outs: 1, labels: 1, spreads: 1, aislesScanned: 1,
      percentageRead: 1, percentageUnread: 1, unreadLabels: 1, readLabelsMissingProduct: 1, readLabelsMatchingProduct: 1 },
  ];
  const daySummaries: DaySummary[] = [
    {
      date: new Date('2018-12-12'),
      dailyAverage: 1,
    }
  ];
  const store: Store = {  storeId: 1,
    storeName: '',
    storeAddress: '',
    totalAverageOuts: 1,
    totalAverageLabels: 1,
    totalAverageSpreads: 1,
    summaryOuts: daySummaries,
    summaryLabels: daySummaries,
    summarySpreads: daySummaries
  };

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getMissionSummaries']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgDatepickerModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        StoreViewComponent,
        AppDailyGraphsStubComponent,
        AppMissionsGridStubComponent,
      ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: {
          params: [{ storeId: 1 }],
        }},
        { provide: EnvironmentService, useValue: { config: {
          apiType: 'odata',
          showCoverageAsPercent: false
        }}}
      ],
    })
    .compileComponents();

    apiService = TestBed.get('ApiService');
    apiService.getMissionSummaries.and.returnValue(of(missions));
    apiService.getStore.and.returnValue(of(store));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the store id', () => {
    expect(component.storeId).toEqual(1);
    expect(component.store).toEqual(store);
  });

  it('should change index', () => {
    const currentDate: Date = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const index = { index: '2', date: currentDate };
    component.setIndex(index);
    expect(component.selectedIndex).toEqual(index.index);
    expect(component.selectedDate).toEqual(index.date);
    expect(component.missionSummaries).toEqual(missions);
  });

  it('should change date on selection', () => {
    const d: Date = new Date();
    d.setHours(0 , 0, 0, 0);
    component.changeGraphDates(d.toString());
    expect(component.graphEndDate.toString()).toEqual(d.toString());
    d.setDate(d.getDate() - 13);
    d.setHours(0 , 0, 0, 0);
    component.changeGraphDates(d.toString());
    expect(component.graphEndDate.toString()).toEqual(d.toString());
  });
});
