import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMissionViewComponent } from './customer-mission-view.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import Label from '../../models/label.model';
import { ModalService } from '../../services/modal.service';
import { EnvironmentService } from '../../services/environment.service';
import Mission from '../../models/mission.model';
import Aisle from '../../models/aisle.model';
import Store from '../../models/store.model';

@Component({selector: 'app-mission-stats', template: ''})
class AppMissionStatsStubComponent {
  @Input() average: string;
  @Input() total: string;
}
@Component({selector: 'app-aisles-grid', template: ''})
class AppAislesGridStubComponent {
  @Input() aisles: string;
  @Input() missionId: string;
  @Input() storeId: number;
}
@Component({selector: 'app-export-modal', template: ''})
class ModalComponent {
  @Input() id: string;
}

describe('CustomerMissionViewComponent', () => {
  let component: CustomerMissionViewComponent;
  let fixture: ComponentFixture<CustomerMissionViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let originalTimeout;

  const aisles: Aisle[] = [
    { aisleId: '1', aisleName: '1111', panoramaUrl: '', labels: [], outs: [], sectionLabels: [], sectionBreaks: [], topStock: [],
      createDateTime: new Date(), outsCount: 0, labelsCount: 0, scanDateTime: new Date(), auditQueueStatus: null }
  ];
  const mission: Mission = { missionId: '1', missionName: '1111', storeId: '1', createDateTime: new Date('2018-12-12'),
    startDateTime: new Date('2018-12-12'), endDateTime: new Date('2018-12-12'), aisleCount: 0, outs: 0, labels: 0,
    readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0, unreadLabels: 0, percentageRead: 0, percentageUnread: 0,
    aisles: aisles, storeName: '', storeNumber: 1 };
  const store: Store = { storeId: '1',   storeNumber: 1, storeName: '', storeAddress: '', totalAverageOuts: 0, totalAverageLabels: 0,
    summaryOuts: [], summaryLabels: [], zoneId: '', robots: [], canary: false };

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getMission', 'getMissions', 'getAisle']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        CustomerMissionViewComponent,
        AppMissionStatsStubComponent,
        AppAislesGridStubComponent,
        ModalComponent
      ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: {
          params: [{ missionId: 1 }, { storeId: 1 }],
        }},
        { provide: ModalService},
        { provide: EnvironmentService, useValue: { config: {
          onHand: true,
          showExportButtons: true,
        }}}
      ],
    })
    .compileComponents();

    apiService = TestBed.get('ApiService');
    apiService.getMission.and.returnValue(of(mission));
    apiService.getAisle.and.returnValue(of(aisles[0]));
    apiService.getStore.and.returnValue(of(store));
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(CustomerMissionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the current mission', () => {
    expect(apiService.getMission).toHaveBeenCalledWith(1, 1, Intl.DateTimeFormat().resolvedOptions().timeZone);
    expect(component.mission.missionId).toEqual('1');
  });

  it('should export data', () => {
    expect().nothing();
  });
});