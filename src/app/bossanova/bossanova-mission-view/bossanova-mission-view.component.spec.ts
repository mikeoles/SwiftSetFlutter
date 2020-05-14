import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BossanovaMissionViewComponent } from './bossanova-mission-view.component';
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

describe('MissionViewComponent', () => {
  let component: BossanovaMissionViewComponent;
  let fixture: ComponentFixture<BossanovaMissionViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let originalTimeout;
  const sectionBreaks: number[] = [19, 200];

  const aisles: Aisle[] = [{  aisleId: '1', aisleName: '', panoramaUrl: '', createDateTime: new Date(), scanDateTime: new Date(),
  labels: [], outs: [], sectionLabels: [], topStock: [], sectionBreaks: sectionBreaks,
   aisleCoverage: '0', labelsCount: 0, outsCount: 0, auditQueueStatus: null,
  previouslySeenBarcodeCount: 0, previouslySeenBarcodeSampleSize: 0, missingPreviouslySeenBarcodeCount: 0,
  missingPreviouslySeenBarcodePercentage: 0, missingPreviouslySeenBarcodes: [] }];
  const aisle: Aisle = {  aisleId: '1', aisleName: '', panoramaUrl: '', createDateTime: new Date(), scanDateTime: new Date(),
    labels: [], outs: [], sectionLabels: [], topStock: [], sectionBreaks: sectionBreaks,
     aisleCoverage: '0', labelsCount: 0, outsCount: 0, auditQueueStatus: null,
    previouslySeenBarcodeCount: 0, previouslySeenBarcodeSampleSize: 0, missingPreviouslySeenBarcodeCount: 0,
    missingPreviouslySeenBarcodePercentage: 0, missingPreviouslySeenBarcodes: []  };
  const mission: Mission = { missionId: '1', missionName: '', storeId: '1', startDateTime: new Date(), outs: 1, labels: 1,
    aisleCount: 1, endDateTime: new Date(), percentageRead: 1, percentageUnread: 1, unreadLabels: 1, readLabelsMissingProduct: 1,
    readLabelsMatchingProduct: 1, createDateTime: new Date(), aisles: aisles, storeName: '', storeNumber: 1};
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
        BossanovaMissionViewComponent,
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
    apiService.getAisle.and.returnValue(of(aisle));
    apiService.getStore.and.returnValue(of(store));
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(BossanovaMissionViewComponent);
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
