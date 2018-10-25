import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlugsSpreadsComponent } from './plugs-spreads.component';

describe('PlugsSpreadsComponent', () => {
  let component: PlugsSpreadsComponent;
  let fixture: ComponentFixture<PlugsSpreadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlugsSpreadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlugsSpreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
