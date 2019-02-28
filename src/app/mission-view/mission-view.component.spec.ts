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

@Component({selector: 'app-mission-stats', template: ''})
class AppStatRingStubComponent {
  @Input() stat: string;
  @Input() current: string;
  @Input() max: string;
}
@Component({selector: 'app-aisles-grid', template: ''})
class AppAislesGridStubComponent {
  @Input() aisles: string;
  @Input() missionId: string;
}
@Component({selector: 'app-export-modal', template: ''})
class ModalComponent {
  @Input() id: string;
}

describe('MissionViewComponent', () => {
  let component: MissionViewComponent;
  let fixture: ComponentFixture<MissionViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const labels: Label[] = [
    { labelId: 1, labelName: 'label name', barcode: '12345', productId: '12345', price: 0.0,
    bounds: { top: 0, left: 0, width: 0, height: 0, topMeters: 0, leftMeters: 0, widthMeters: 0, heightMeters: 0 },
    customFields: [], section: '', department: '' },
    { labelId: 2, labelName: 'label name', barcode: '550376332', productId: '12345', price: 0.0,
    bounds: { top: 0, left: 0, width: 0, height: 0, topMeters: 0, leftMeters: 0, widthMeters: 0, heightMeters: 0 },
    customFields: [], section: '', department: '' },
  ];
  const mission = { id: 1, name: '1111', createDateTime: new Date('2018-12-12'), missionDateTime: new Date('2018-12-12') };
  const missionSummary = {   missionId: 1, mission: '', storeId: '', missionDateTime: new Date('2018-12-12'),
  outs: 1, labels: 1, spreads: 1, aislesScanned: 1};
  const aisles = [{  id: 1, name: '', panoramaUrl: '', labels: labels, outs: labels, spreads: [] }];
  const aisle = {  id: 1, name: '', panoramaUrl: '', labels: labels, outs: labels, spreads: [] };
  const store = { id: 1 };

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getMission', 'getMissionSummary', 'getAisles', 'getAisle']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        MissionViewComponent,
        AppStatRingStubComponent,
        AppAislesGridStubComponent,
        ModalComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: {
          params: [{ missionId: 1 }],
        }},
        { provide: ModalService}
      ],
    })
    .compileComponents();

    apiService = TestBed.get(ApiService);
    apiService.getMission.and.returnValue(of(mission));
    apiService.getMissionSummary.and.returnValue(of(missionSummary));
    apiService.getAisles.and.returnValue(of(aisles));
    apiService.getAisle.and.returnValue(of(aisle));
    apiService.getStore.and.returnValue(of(store));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the current mission', () => {
    expect(component.currentMission).toEqual(1);
    expect(apiService.getMission).toHaveBeenCalledWith(1);
  });

  it('should export data', () => {
    // TODO: Figure out how to test the link
    expect().nothing();
  });
});
