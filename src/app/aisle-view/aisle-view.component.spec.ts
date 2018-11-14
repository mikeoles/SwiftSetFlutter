import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AisleViewComponent } from './aisle-view.component';

describe('AisleViewComponent', () => {
  let component: AisleViewComponent;
  let fixture: ComponentFixture<AisleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AisleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AisleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
