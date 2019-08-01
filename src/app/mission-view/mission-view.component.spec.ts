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
    bounds: { top: 0, left: 0, width: 0, height: 0 },
    customFields: [], section: '', department: '', onHand: 0 },
    { labelName: 'label name', labelId: 1, barcode: '550376332', productId: '12345', price: 0.0,
    bounds: { top: 0, left: 0, width: 0, height: 0 },
    customFields: [], section: '', department: '', onHand: 0 },
  ];
  const aisles: Aisle[] = [{  aisleId: '1', aisleName: '', panoramaUrl: '', labels: labels, outs: labels, coveragePercent: 0,
  aisleCoverage: '0', createDateTime: new Date(), labelsCount: 0, outsCount: 0 }];
  const aisle: Aisle = {  aisleId: '1', aisleName: '', panoramaUrl: '', labels: labels, outs: labels, coveragePercent: 0,
  aisleCoverage: '0', createDateTime: new Date(), labelsCount: 0, outsCount: 0 };
  const mission: Mission = { missionId: '1', missionName: '', storeId: '1', startDateTime: new Date(), outs: 1, labels: 1,
    aisleCount: 1, endDateTime: new Date(), percentageRead: 1, percentageUnread: 1, unreadLabels: 1, readLabelsMissingProduct: 1,
    readLabelsMatchingProduct: 1, createDateTime: new Date(), aisles: aisles };
  const store = { storeId: 1 };

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
          exportingPDF: true,
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
    component.exportOnHand = false;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the current mission', () => {
    expect(apiService.getMission).toHaveBeenCalledWith(1, 1);
    expect(component.mission.missionId).toEqual('1');
  });

  it('should export data', () => {
    // TODO: Figure out how to test the link
    expect().nothing();
  });
});
