import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramaComponent } from './panorama.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('PanoramaComponent', () => {
  let component: PanoramaComponent;
  let fixture: ComponentFixture<PanoramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanoramaComponent ],
      imports: [ FontAwesomeModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
