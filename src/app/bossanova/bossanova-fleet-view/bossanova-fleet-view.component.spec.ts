import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BossanovaFleetViewComponent } from './bossanova-fleet-view.component';

describe('BossanovaFleetViewComponent', () => {
  let component: BossanovaFleetViewComponent;
  let fixture: ComponentFixture<BossanovaFleetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossanovaFleetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BossanovaFleetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
