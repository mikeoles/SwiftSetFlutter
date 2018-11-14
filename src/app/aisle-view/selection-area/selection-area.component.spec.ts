import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionAreaComponent } from './selection-area.component';
import { FormsModule } from '@angular/forms';
import outs from '../mock/outs.json';
import labels from '../mock/labels.json';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SelectionAreaComponent', () => {
  let component: SelectionAreaComponent;
  let fixture: ComponentFixture<SelectionAreaComponent>;
  let missionsButtonEl: HTMLButtonElement;
  let aislesButtonEl: HTMLButtonElement;
  let missionsDropdownEl: HTMLElement;
  let aislesDropdownEl: HTMLElement;
  let missionsListEl: HTMLLIElement;
  let aislesListEl: HTMLLIElement;
  const missionsData = of(outs);
  const aislesData = of(labels);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ SelectionAreaComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionAreaComponent);
    component = fixture.componentInstance;
    component.missionId = 1;
    component.aisleId = '1';
    component.showAisles = true;
    component.showMissions = true;
    missionsData.subscribe(missions => component.missions = missions);
    aislesData.subscribe(aisles => component.aisles = aisles);
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

  it('has a dropdown of missions', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(missionsDropdownEl.childElementCount).toEqual(5);
      expect(missionsDropdownEl.children[0].textContent).toEqual('Mission 1');
    });
  });

  it('has a dropdown of aisles', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesDropdownEl.childElementCount).toEqual(5);
      expect(aislesDropdownEl.children[4].textContent).toEqual('Aisle 5');
    });
  });

  it('emits mission when selected', () => {
    spyOn(component.selectedMission, 'emit');
    missionsListEl.click();
    missionsListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectedMission.emit).toHaveBeenCalledWith(2);
  });

  it('emits aisle when selected', () => {
    spyOn(component.selectedAisle, 'emit');
    aislesListEl.click();
    aislesListEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectedAisle.emit).toHaveBeenCalledWith(4);
  });

  it('starts by displaying first mission', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(missionsButtonEl.textContent).toEqual('Mission 1');
    });
  });

  it('automatically selects first aisle from selected mission', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesButtonEl.textContent).toEqual('Aisle 1');
    });
  });

  it('sets mission button based on input', () => {
    component.missionId  = 3;
    fixture.detectChanges();
    expect(missionsButtonEl.textContent).toEqual('Mission 3');
  });

  it('sets mission button based on input', () => {
    component.aisleId  = '5';
    fixture.detectChanges();
    expect(aislesButtonEl.textContent).toEqual('Aisle 5');
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
