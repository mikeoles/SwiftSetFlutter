import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugPanoramaComponent } from './debug-panorama.component';

describe('DebugPanoramaComponent', () => {
  let component: DebugPanoramaComponent;
  let fixture: ComponentFixture<DebugPanoramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugPanoramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugPanoramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
