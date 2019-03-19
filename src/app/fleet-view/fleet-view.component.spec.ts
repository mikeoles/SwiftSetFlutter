import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetViewComponent } from './fleet-view.component';
import Store from '../store.model';
import { ApiService } from '../api.service';
import DaySummary from '../daySummary.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetViewComponent', () => {
  let component: FleetViewComponent;
  let fixture: ComponentFixture<FleetViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  const daySummaries: DaySummary[] = [
    {
      date: new Date('2018-12-12'),
      dailyAverage: 1,
    }
  ];
  const stores: Store[] = [{
    storeId: 1,
    storeName: '',
    storeAddress: '',
    totalAverageOuts: 1,
    totalAverageLabels: 1,
    totalAverageSpreads: 1,
    summaryOuts: daySummaries,
    summaryLabels: daySummaries,
    summarySpreads: daySummaries
  }];

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStores']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ FleetViewComponent ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy }
      ]

    })
    .compileComponents();

    apiService = TestBed.get('ApiService');
    apiService.getStores.and.returnValue(of(stores));
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
