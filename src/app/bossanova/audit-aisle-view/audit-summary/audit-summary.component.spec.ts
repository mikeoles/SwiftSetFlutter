import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSummaryComponent } from './audit-summary.component';

describe('AuditSummaryComponent', () => {
  let component: AuditSummaryComponent;
  let fixture: ComponentFixture<AuditSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
