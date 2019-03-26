import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsGridComponent } from './missions-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import MissionSummary from 'src/app/missionSummary.model';

describe('MissionsGridComponent', () => {
  let component: MissionsGridComponent;
  let fixture: ComponentFixture<MissionsGridComponent>;

  const missionSummaries: MissionSummary[] = [
    { missionId: 0, mission: '', storeId: 0, missionDateTime: new Date(), outs: 0, labels: 0, spreads: 0, aislesScanned: 0 }
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
    component.missionSummaries = missionSummaries;
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
