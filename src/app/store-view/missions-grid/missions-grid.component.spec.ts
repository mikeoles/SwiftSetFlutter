import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsGridComponent } from './missions-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('MissionsGridComponent', () => {
  let component: MissionsGridComponent;
  let fixture: ComponentFixture<MissionsGridComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to a mission', () => {
    const navigateSpy = spyOn(TestBed.get(Router), 'navigate');

    component.viewMission(1);

    expect(navigateSpy).toHaveBeenCalledWith(['mission/1']);
  });
});
