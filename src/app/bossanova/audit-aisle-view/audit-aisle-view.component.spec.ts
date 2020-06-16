import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAisleViewComponent } from './audit-aisle-view.component';

describe('AuditAisleViewComponent', () => {
  let component: AuditAisleViewComponent;
  let fixture: ComponentFixture<AuditAisleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditAisleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditAisleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
