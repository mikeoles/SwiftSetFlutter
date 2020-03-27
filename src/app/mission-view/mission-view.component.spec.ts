import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionViewComponent } from './mission-view.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import Label from '../label.model';
import { ModalService } from '../modal/modal.service';
import { EnvironmentService } from '../environment.service';
import Mission from '../mission.model';
import Aisle from '../aisle.model';
import Store from '../store.model';

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
  let component: MissionViewComponent;
  let fixture: ComponentFixture<MissionViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let originalTimeout;

  const labels: Label[] = [
    { labelName: 'label name', labelId: 1, barcode: '12345', productId: '12345', price: 0.0,
    bounds: { top: 0, left: 0, width: 0, height: 0}, annotations: [], annotationColor: '',
    customFields: [], section: '', department: '', onHand: 0, productCoordinates: [] },
    { labelName: 'label name', labelId: 1, barcode: '550376332', productId: '12345', price: 0.0,
    bounds: { top: 0, left: 0, width: 0, height: 0 }, annotations: [], annotationColor: '',
    customFields: [], section: '', department: '', onHand: 0, productCoordinates: [] },
  ];

  const sectionBreaks: number[] = [19, 200];

  const aisles: Aisle[] = [{  aisleId: '1', aisleName: '', panoramaUrl: '', createDateTime: new Date(),
  labels: labels, outs: labels, sectionLabels: labels, topStock: labels, sectionBreaks: sectionBreaks,
  coveragePercent: 0, aisleCoverage: '0', labelsCount: 0, outsCount: 0 }];
  const aisle: Aisle = {  aisleId: '1', aisleName: '', panoramaUrl: '', createDateTime: new Date(),
    labels: labels, outs: labels, sectionLabels: labels, topStock: labels, sectionBreaks: sectionBreaks,
    coveragePercent: 0, aisleCoverage: '0', labelsCount: 0, outsCount: 0 };
  const mission: Mission = { missionId: '1', missionName: '', storeId: '1', startDateTime: new Date(), outs: 1, labels: 1,
    aisleCount: 1, endDateTime: new Date(), percentageRead: 1, percentageUnread: 1, unreadLabels: 1, readLabelsMissingProduct: 1,
    readLabelsMatchingProduct: 1, createDateTime: new Date(), aisles: aisles };
  const store: Store = { storeId: '1',   storeNumber: 1, storeName: '', storeAddress: '', totalAverageOuts: 0, totalAverageLabels: 0,
    summaryOuts: [], summaryLabels: [], timezone: '', robots: [] };

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getMission', 'getMissions', 'getAisle']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        MissionViewComponent,
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
    fixture = TestBed.createComponent(MissionViewComponent);
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
