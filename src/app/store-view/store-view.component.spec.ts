import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreViewComponent } from './store-view.component';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import MissionSummary from '../missionSummary.model';

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

}

describe('StoreViewComponent', () => {
  let component: StoreViewComponent;
  let fixture: ComponentFixture<StoreViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const missions: MissionSummary[] = [
    { mission: '1', storeId: '1', missionDateTime: new Date(), outs: 5, labels: 6, spreads: 7, aislesScanned: 2 },
  ];
  const store: any = {};

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getDateMissions']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [
        StoreViewComponent,
        AppDailyGraphsStubComponent,
        AppMissionsGridStubComponent,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: {
          params: [{ storeId: '1' }],
        }},
      ],
    })
    .compileComponents();

    apiService = TestBed.get(ApiService);
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
});
