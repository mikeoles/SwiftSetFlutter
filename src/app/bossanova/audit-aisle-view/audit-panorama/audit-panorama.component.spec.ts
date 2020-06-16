import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPanoramaComponent } from './audit-panorama.component';

describe('AuditPanoramaComponent', () => {
  let component: AuditPanoramaComponent;
  let fixture: ComponentFixture<AuditPanoramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPanoramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPanoramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
