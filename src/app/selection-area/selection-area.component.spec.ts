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
  let missionsDropdownEl: HTMLSelectElement;
  let aislesDropdownEl: HTMLSelectElement;
  let missionsData = of(outs);
  let aislesData = of(labels);

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
    component.aisleId = "1";
    missionsData.subscribe(missions => component.missions = missions);
    aislesData.subscribe(aisles => component.aisles = aisles);
    missionsDropdownEl = fixture.debugElement.query(By.css('#missions')).nativeElement;
    aislesDropdownEl = fixture.debugElement.query(By.css('#aisles')).nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has a dropdown of missions', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(missionsDropdownEl.length).toEqual(5);
      expect(missionsDropdownEl.options[0].text).toContain("Mission 1");
    });
  });

  it('has a dropdown of aisles', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesDropdownEl.length).toEqual(5);
      expect(aislesDropdownEl.options[4].text).toContain("Aisle 5");
    });
  });


  it('emits mission when selected', () => {
    spyOn(component.selectedMission, 'emit');
    missionsDropdownEl.value='2'; 
    missionsDropdownEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectedMission.emit).toHaveBeenCalledWith('2');
  });

  it('emits aisle when selected', () => {
    spyOn(component.selectedAisle, 'emit');
    aislesDropdownEl.value='3'; 
    aislesDropdownEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectedAisle.emit).toHaveBeenCalledWith('3');
  });

  it('starts by displaying first mission', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(missionsDropdownEl.value).toEqual("1");
    });
  });

  it('automatically selects first aisle from selected mission', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesDropdownEl.value).toEqual("1");
    });
  });

  it('allows the user to select a new aisle', () => {
    missionsDropdownEl.value='4'; 
    aislesDropdownEl.value='3'; 
    aislesDropdownEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesDropdownEl.value).toEqual("1");
    });
    //Aisle should change
    expect(aislesDropdownEl.value).toEqual("3");
    //Mission should not change
    expect(missionsDropdownEl.value).toEqual("4");
  });

  it('resets the aisle after new mission selected', () => {
    //Change aisle to 3
    aislesDropdownEl.value='3'; 
    aislesDropdownEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    //Select a new misison
    missionsDropdownEl.value='4'; 
    missionsDropdownEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    //Check that aisle returns to 1
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(aislesDropdownEl.value).toEqual("1");
    });
  });


});
