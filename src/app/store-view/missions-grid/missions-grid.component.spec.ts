import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsGridComponent } from './missions-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import Aisle from 'src/app/aisle.model';
import Mission from 'src/app/mission.model';

describe('MissionsGridComponent', () => {
  let component: MissionsGridComponent;
  let fixture: ComponentFixture<MissionsGridComponent>;
  const aisles: Aisle[] = [
    { aisleId: '1', aisleName: '1111', panoramaUrl: '', labels: [], outs: [], sectionLabels: [], createDateTime: new Date(),
    coveragePercent: 0, outsCount: 0, labelsCount: 0,
    aisleCoverage: ''},
    { aisleId: '2', aisleName: '2222', panoramaUrl: '', labels: [], outs: [], sectionLabels: [], createDateTime: new Date(),
    coveragePercent: 0, outsCount: 0, labelsCount: 0,
    aisleCoverage: ''},
  ];
  const missions: Mission[] = [
    { missionId: '1', missionName: '1111', storeId: '1', createDateTime: new Date('2018-12-12'), startDateTime: new Date('2018-12-12'),
      endDateTime: new Date('2018-12-12'), aisleCount: 0, outs: 0, labels: 0, readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0,
      unreadLabels: 0, percentageRead: 0, percentageUnread: 0, aisles: aisles  },
    { missionId: '2', missionName: '2222', storeId: '1', createDateTime: new Date('2001-01-01'), startDateTime: new Date('2001-01-01'),
      endDateTime: new Date('2001-01-01'), aisleCount: 0, outs: 0, labels: 0, readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0,
      unreadLabels: 0, percentageRead: 0, percentageUnread: 0 , aisles: aisles },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ MissionsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsGridComponent);
    component = fixture.componentInstance;
    component.missions = missions;
    component.storeId = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to a mission', () => {
    const navigateSpy = spyOn(TestBed.get(Router), 'navigate');

    component.viewMission(1);

    expect(navigateSpy).toHaveBeenCalledWith(['store/2/mission/1']);
  });
});
