import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreViewComponent } from './store-view.component';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IApiService } from '../api.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';
import DaySummary from '../daySummary.model';
import Store from '../store.model';
import { NgDatepickerModule } from 'ng2-datepicker';
import { ODataApiService } from '../oDataApi.service';

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
}

describe('StoreViewComponent', () => {
  let component: StoreViewComponent;
  let fixture: ComponentFixture<StoreViewComponent>;
  let apiService: jasmine.SpyObj<IApiService>;

  const missions: MissionSummary[] = [
    { missionId: 1, mission: '', storeId: '', missionDateTime: new Date(), outs: 1, labels: 1, spreads: 1, aislesScanned: 1 },
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
    const apiServiceSpy = jasmine.createSpyObj('IApiService', ['getStore', 'getMissionSummaries']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgDatepickerModule
      ],
      declarations: [
        StoreViewComponent,
        AppDailyGraphsStubComponent,
        AppMissionsGridStubComponent,
      ],
      providers: [
        { provide: ODataApiService, useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: {
          params: [{ storeId: '1' }],
        }},
      ],
    })
    .compileComponents();

    apiService = TestBed.get(ODataApiService);
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
    expect(component.storeId).toEqual('1');
    expect(component.store).toEqual(store);
  });

  it('should change index', () => {
    const index = { index: '2', date: new Date() };
    component.setIndex(index);
    expect(component.selectedIndex).toEqual(index.index);
    expect(component.selectedDate).toEqual(index.date);
    expect(component.missionSummaries).toEqual(missions);
  });

  it('should change date on selection', () => {
    const d: Date = new Date();
    component.changeGraphDates(d.toString());
    expect(component.graphStartDate.toString()).toEqual(d.toString());
    d.setDate(d.getDate() - 13);
    component.changeGraphDates(d.toString());
    expect(component.graphStartDate.toString()).toEqual(d.toString());
  });
});
