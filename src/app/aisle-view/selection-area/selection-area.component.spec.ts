import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionAreaComponent } from './selection-area.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import Aisle from '../../models/aisle.model';
import Mission from '../../models/mission.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalService } from 'src/app/modal/modal.service';
import { EnvironmentService } from 'src/app/services/environment.service';
import { ApiService } from 'src/app/services/api.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({selector: 'app-export-modal', template: ''})
class ModalComponent {
  @Input() id: string;
}

describe('SelectionAreaComponent', () => {
  let component: SelectionAreaComponent;
  let fixture: ComponentFixture<SelectionAreaComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let missionsButtonEl: HTMLButtonElement;
  let aislesButtonEl: HTMLButtonElement;
  let missionsDropdownEl: HTMLElement;
  let aislesDropdownEl: HTMLElement;
  let missionsListEl: HTMLLIElement;
  let aislesListEl: HTMLLIElement;
  const aisles: Aisle[] = [
    { aisleId: '1', aisleName: '1111', panoramaUrl: '', createDateTime: new Date(),
      labels: [], outs: [], sectionLabels: [], sectionBreaks: [], topStock: [],
      coveragePercent: 0, outsCount: 0, labelsCount: 0, aisleCoverage: ''},
    { aisleId: '2', aisleName: '2222', panoramaUrl: '', createDateTime: new Date(),
      labels: [], outs: [], sectionLabels: [], sectionBreaks: [], topStock: [],
      coveragePercent: 0, outsCount: 0, labelsCount: 0, aisleCoverage: ''},
    { aisleId: '3', aisleName: '3333', panoramaUrl: '', createDateTime: new Date(),
      labels: [], outs: [], sectionLabels: [], sectionBreaks: [], topStock: [],
      coveragePercent: 0, outsCount: 0, labelsCount: 0, aisleCoverage: ''},
    { aisleId: '4', aisleName: '4444', panoramaUrl: '', createDateTime: new Date(),
      labels: [], outs: [], sectionLabels: [], sectionBreaks: [], topStock: [],
      coveragePercent: 0, outsCount: 0, labelsCount: 0, aisleCoverage: ''},
    { aisleId: '5', aisleName: '5555', panoramaUrl: '', createDateTime: new Date(),
      labels: [], outs: [], sectionLabels: [], sectionBreaks: [], topStock: [],
      coveragePercent: 0, outsCount: 0, labelsCount: 0, aisleCoverage: '' },
  ];

  const missions: Mission[] = [
    { missionId: '1', missionName: '1111', storeId: '1', createDateTime: new Date('2018-12-12'), startDateTime: new Date('2018-12-12'),
      endDateTime: new Date('2018-12-12'), aisleCount: 0, outs: 0, labels: 0, readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0,
      unreadLabels: 0, percentageRead: 0, percentageUnread: 0, aisles: aisles, storeName: '', storeNumber: 1  },
    { missionId: '2', missionName: '2222', storeId: '1', createDateTime: new Date('2001-01-01'), startDateTime: new Date('2001-01-01'),
      endDateTime: new Date('2001-01-01'), aisleCount: 0, outs: 0, labels: 0, readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0,
      unreadLabels: 0, percentageRead: 0, percentageUnread: 0 , aisles: aisles, storeName: '', storeNumber: 1 },
  ];
  const mission: Mission = { missionId: '2', missionName: '2222', storeId: '1', createDateTime: new Date('2001-01-01'),
    startDateTime: new Date('2001-01-01'), endDateTime: new Date('2001-01-01'), aisleCount: 0, outs: 0, labels: 0,
    readLabelsMissingProduct: 0, readLabelsMatchingProduct: 0, unreadLabels: 0, percentageRead: 0, percentageUnread: 0 ,
    aisles: aisles, storeName: '', storeNumber: 1 };
    const store = { storeId: '1',   storeNumber: 1, storeName: '', storeAddress: '', totalAverageOuts: 0, totalAverageLabels: 0,
    summaryOuts: [], summaryLabels: [], zoneId: '', robots: [] };

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getMission', 'getAisle', 'getRoles']);

    TestBed.configureTestingModule({
      imports: [FormsModule, FontAwesomeModule],
      declarations: [ SelectionAreaComponent, ModalComponent ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy },
        { provide: ModalService},
        { provide: EnvironmentService, useValue: { config: {
          onHand: true,
          showExportButtons: true,
          permissions: ['topStock', 'QA', 'sectionLabels', 'sectionBreaks', 'misreadBarcodes']
        }}},
        { provide: Router },
      ]
    })
    .compileComponents();

    apiService = TestBed.get('ApiService');
    apiService.getStore.and.returnValue(of(store));
    apiService.getRoles.and.returnValue(of('bossanova'));
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionAreaComponent);
    component = fixture.componentInstance;
    component.missions = missions;
    component.aisles = mission.aisles;
    component.selectedMission = missions[0];
    component.selectedAisle = mission.aisles[0];
    fixture.detectChanges();
    missionsButtonEl = fixture.debugElement.query(By.css('#missionsContainer > button')).nativeElement;
    aislesButtonEl = fixture.debugElement.query(By.css('#aislesContainer > button')).nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has a dropdown of missions', done => {
    fixture.whenStable().then(() => {
      component.currentDropdown = 'missions';
      fixture.detectChanges();
      missionsDropdownEl = fixture.debugElement.query(By.css('#missionsContainer > ul')).nativeElement;
      expect(missionsDropdownEl.childElementCount).toEqual(2);
      expect(missionsDropdownEl.children[0].textContent).toEqual(' ' + missions[0].missionName + ' ');
      done();
    });
  });

  it('has a dropdown of aisles', done => {
    fixture.whenStable().then(() => {
      component.currentDropdown = 'aisles';
      fixture.detectChanges();
      aislesDropdownEl = fixture.debugElement.query(By.css('#aislesContainer > ul')).nativeElement;
      expect(aislesDropdownEl.childElementCount).toEqual(5);
      expect(aislesDropdownEl.children[4].textContent).toEqual(' 5555 ');
      done();
    });
  });

  it('emits mission when selected', () => {
    spyOn(component.missionSelected, 'emit');
    component.currentDropdown = 'missions';
    fixture.detectChanges();
    missionsListEl = fixture.debugElement.query(By.css('#missionsContainer > ul > li:nth-child(2)')).nativeElement;
    missionsListEl.click();
    missionsListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.missionSelected.emit).toHaveBeenCalledWith(missions[1]);
  });

  it('emits aisle when selected', () => {
    spyOn(component.aisleSelected, 'emit');
    component.currentDropdown = 'aisles';
    fixture.detectChanges();
    aislesListEl = fixture.debugElement.query(By.css('#aislesContainer > ul > li:nth-child(4)')).nativeElement;
    aislesListEl.click();
    aislesListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.aisleSelected.emit).toHaveBeenCalledWith(aisles[3]);
  });

  it('starts by displaying first mission', done => {
    fixture.whenStable().then(() => {
      const pipe = new DatePipe('en');
      fixture.detectChanges();
      expect(missionsButtonEl.textContent).toEqual(` Scan: ${missions[0].missionName} `);
      done();
    });
  });

  it('automatically selects first aisle from selected mission', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesButtonEl.textContent).toEqual(' Aisle 1111 ');
      done();
    });
  });

  it('sets mission button based on input', () => {
    const pipe = new DatePipe('en');
    component.selectedMission  = missions[1];
    fixture.detectChanges();
    expect(missionsButtonEl.textContent).toEqual(` Scan: ${missions[1].missionName} `);
  });

  it('sets mission button based on input', () => {
    component.selectedAisle = aisles[1];
    fixture.detectChanges();
    expect(aislesButtonEl.textContent).toEqual(' Aisle 2222 ');
  });

});
