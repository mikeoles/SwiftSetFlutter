import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditQueueViewComponent } from './audit-queue-view.component';

describe('AuditQueueViewComponent', () => {
  let component: AuditQueueViewComponent;
  let fixture: ComponentFixture<AuditQueueViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditQueueViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditQueueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
