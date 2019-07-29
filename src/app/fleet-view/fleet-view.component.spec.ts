// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { FleetViewComponent } from './fleet-view.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import Store from '../store.model';
// import DaySummary from '../daySummary.model';
// import { ApiService } from '../api.service';
// import { of } from 'rxjs';

// describe('FleetViewComponent', () => {
//   let component: FleetViewComponent;
//   let fixture: ComponentFixture<FleetViewComponent>;
//   let apiService: jasmine.SpyObj<ApiService>;

//   const daySummaries: DaySummary[] = [
//     {
//       date: new Date('2018-12-12'),
//       dailyAverage: 1,
//     }
//   ];
//   const stores: Store[] = [{
//     storeId: 1,
//     storeName: '',
//     storeAddress: '',
//     totalAverageOuts: 1,
//     totalAverageLabels: 1,
//     summaryOuts: daySummaries,
//     summaryLabels: daySummaries,
//   }];

//   beforeEach(async(() => {
//     const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStores']);

//     TestBed.configureTestingModule({
//       declarations: [ FleetViewComponent ],
//       imports: [
//         RouterTestingModule.withRoutes([])
//       ],
//       providers: [
//         { provide: 'ApiService', useValue: apiServiceSpy },
//       ]
//     })
//     .compileComponents();

//     apiService = TestBed.get('ApiService');
//     apiService.getStores.and.returnValue(of(stores));
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(FleetViewComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
