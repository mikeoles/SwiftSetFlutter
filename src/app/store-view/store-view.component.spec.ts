import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreViewComponent } from './store-view.component';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import Mission from '../mission.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

@Component({selector: 'app-daily-graphs', template: ''})
class AppDailyGraphsStubComponent {
  @Input() data: any[];
  @Input() overallAverage: string;
  @Input() currentIndex: string;
}
@Component({selector: 'app-missions-grid', template: ''})
class AppMissionsGridStubComponent {
  @Input() missions: any[];
  @Input() missionsDate: any[];
}

describe('StoreViewComponent', () => {
  let component: StoreViewComponent;
  let fixture: ComponentFixture<StoreViewComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const missions: Mission[] = [
    { id: 1, name: '1111', createDateTime: new Date('2018-12-12'), missionDateTime: new Date('2018-12-12') },
    { id: 2, name: '2222', createDateTime: new Date('2001-01-01'), missionDateTime: new Date('2001-01-01') },
  ];
  const store: any = {};

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getDateMissions']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        StoreViewComponent,
        AppDailyGraphsStubComponent,
        AppMissionsGridStubComponent,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    })
    .compileComponents();

    apiService = TestBed.get(ApiService);
    apiService.getDateMissions.and.returnValue(of(missions));
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
});
