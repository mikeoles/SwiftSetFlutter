import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionAreaComponent } from './selection-area.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import Aisle from '../../aisle.model';
import Mission from '../../mission.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalService } from 'src/app/modal/modal.service';
import { EnvironmentService } from 'src/app/environment.service';
import { ApiService } from 'src/app/api.service';
import { of } from 'rxjs';

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
  const missions: Mission[] = [
    { missionId: 1, missionName: '1111', storeId: '1', createDateTime: new Date('2018-12-12'), missionDateTime: new Date('2018-12-12') },
    { missionId: 2, missionName: '2222', storeId: '1', createDateTime: new Date('2001-01-01'), missionDateTime: new Date('2001-01-01') },
  ];
  const aisles: Aisle[] = [
    { aisleId: 1, aisleName: '1111', panoramaUrl: '', labels: [], outs: [], createDateTime: new Date(),
    coveragePercent: 0, outsCount: 0, labelsCount: 0,
    aisleCoverage: ''},
    { aisleId: 2, aisleName: '2222', panoramaUrl: '', labels: [], outs: [], createDateTime: new Date(),
    coveragePercent: 0, outsCount: 0, labelsCount: 0,
    aisleCoverage: ''},
    { aisleId: 3, aisleName: '3333', panoramaUrl: '', labels: [], outs: [], createDateTime: new Date(),
    coveragePercent: 0, outsCount: 0, labelsCount: 0,
    aisleCoverage: ''},
    { aisleId: 4, aisleName: '4444', panoramaUrl: '', labels: [], outs: [], createDateTime: new Date(),
    coveragePercent: 0, outsCount: 0, labelsCount: 0,
    aisleCoverage: ''},
    { aisleId: 5, aisleName: '5555', panoramaUrl: '', labels: [], outs: [], createDateTime: new Date(),
    coveragePercent: 0, outsCount: 0, labelsCount: 0,
    aisleCoverage: '' },
  ];
  const store = { storeId: 1 };

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getStore', 'getMission', 'getMissionSummary', 'getAisles', 'getAisle']);

    TestBed.configureTestingModule({
      imports: [FormsModule, FontAwesomeModule],
      declarations: [ SelectionAreaComponent, ModalComponent ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy },
        { provide: ModalService},
        { provide: EnvironmentService, useValue: { config: {
          onHand: true,
          exportingPDF: true
        }}}
      ]
    })
    .compileComponents();

    apiService = TestBed.get('ApiService');
    apiService.getStore.and.returnValue(of(store));
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionAreaComponent);
    component = fixture.componentInstance;
    component.showAisles = true;
    component.showMissions = true;
    component.exportOnHand = false;
    component.missions = missions;
    component.aisles = aisles;
    component.selectedMission = missions[0];
    component.selectedAisle = aisles[0];
    fixture.detectChanges();
    missionsButtonEl = fixture.debugElement.query(By.css('#missionsContainer > button')).nativeElement;
    aislesButtonEl = fixture.debugElement.query(By.css('#aislesContainer > button')).nativeElement;
    missionsDropdownEl = fixture.debugElement.query(By.css('#missionsContainer > ul')).nativeElement;
    aislesDropdownEl = fixture.debugElement.query(By.css('#aislesContainer > ul')).nativeElement;
    missionsListEl = fixture.debugElement.query(By.css('#missionsContainer > ul > li:nth-child(2)')).nativeElement;
    aislesListEl = fixture.debugElement.query(By.css('#aislesContainer > ul > li:nth-child(4)')).nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has a dropdown of missions', done => {
    fixture.whenStable().then(() => {
      const pipe = new DatePipe('en');
      fixture.detectChanges();
      expect(missionsDropdownEl.childElementCount).toEqual(2);
      expect(missionsDropdownEl.children[0].textContent).toEqual(pipe.transform(missions[0].missionDateTime, ' yyyy-MM-dd HH:mm:ss '));
      done();
    });
  });

  it('has a dropdown of aisles', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesDropdownEl.childElementCount).toEqual(5);
      expect(aislesDropdownEl.children[4].textContent).toEqual(' 5555 ');
      done();
    });
  });

  it('emits mission when selected', () => {
    spyOn(component.missionSelected, 'emit');
    missionsListEl.click();
    missionsListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.missionSelected.emit).toHaveBeenCalledWith(missions[1]);
  });

  it('emits aisle when selected', () => {
    spyOn(component.aisleSelected, 'emit');
    aislesListEl.click();
    aislesListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.aisleSelected.emit).toHaveBeenCalledWith(aisles[3]);
  });

  it('starts by displaying first mission', done => {
    fixture.whenStable().then(() => {
      const pipe = new DatePipe('en');
      fixture.detectChanges();
      expect(missionsButtonEl.textContent).toEqual(` Mission ${pipe.transform(missions[0].missionDateTime, 'yyyy-MM-dd HH:mm:ss')} `);
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
    expect(missionsButtonEl.textContent).toEqual(` Mission ${pipe.transform(missions[1].missionDateTime, 'yyyy-MM-dd HH:mm:ss')} `);
  });

  it('sets mission button based on input', () => {
    component.selectedAisle = aisles[1];
    fixture.detectChanges();
    expect(aislesButtonEl.textContent).toEqual(' Aisle 2222 ');
  });

  it('hide missions dropdown after click', () => {
    expect(component.showMissions).toEqual(true);
    missionsListEl.click();
    missionsListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.showMissions).toEqual(false);
  });

  it('hide aisles dropdown after click', () => {
    expect(component.showAisles).toEqual(true);
    aislesListEl.click();
    aislesListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.showAisles).toEqual(false);
  });

});
