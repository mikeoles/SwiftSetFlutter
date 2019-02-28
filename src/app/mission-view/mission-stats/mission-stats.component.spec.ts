import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatRingComponent } from './mission-stats.component';
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

describe('StatRingComponent', () => {
  let component: StatRingComponent;
  let fixture: ComponentFixture<StatRingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StatRingComponent,
        RoundProgressStubComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatRingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
