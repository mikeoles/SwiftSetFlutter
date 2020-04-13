import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugViewComponent } from './debug-view.component';

describe('DebugViewComponent', () => {
  let component: DebugViewComponent;
  let fixture: ComponentFixture<DebugViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
