import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AislesGridComponent } from './aisles-grid.component';

describe('AislesGridComponent', () => {
  let component: AislesGridComponent;
  let fixture: ComponentFixture<AislesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AislesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AislesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
