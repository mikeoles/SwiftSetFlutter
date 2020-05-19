import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionStatsComponent } from './mission-stats.component';
import { Component, Input } from '@angular/core';

// tslint:disable-next-line:component-selector Stubbing existing component
@Component({selector: 'round-progress', template: ''})
class RoundProgressStubComponent {
  @Input() current: string;
  @Input() max: string;
  @Input() color: string;
  @Input() stroke: string;
  @Input() radius: string;
  @Input() duration: string;
}

describe('MissionStatsComponent', () => {
  let component: MissionStatsComponent;
  let fixture: ComponentFixture<MissionStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MissionStatsComponent,
        RoundProgressStubComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});