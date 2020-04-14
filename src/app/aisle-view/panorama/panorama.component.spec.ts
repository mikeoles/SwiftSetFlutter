import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramaComponent } from './panorama.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { EnvironmentService } from '../../services/environment.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('PanoramaComponent', () => {
  let component: PanoramaComponent;
  let fixture: ComponentFixture<PanoramaComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService',
      ['getMisreadCategories', 'getMissedCategories', 'getFalsePositiveCategories', 'getFalseNegativeCategories']
    );

    TestBed.configureTestingModule({
      declarations: [ PanoramaComponent ],
      imports: [ FontAwesomeModule ],
      providers: [
        { provide: 'ApiService', useValue: apiServiceSpy },
        { provide: EnvironmentService, useValue: {
          config: { permissions: ['topStock', 'QA', 'sectionLabels', 'sectionBreaks', 'misreadBarcodes'] },
          },
        },
      { provide: Router, useValue: {
          url: ''
      } },
      { provide: ActivatedRoute, useValue: {
        snapshot: {
          queryParams: '1'
        }
      }},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanoramaComponent);
    component = fixture.componentInstance;

    component.qaMode = false;
    apiService = TestBed.get('ApiService');
    apiService.getMisreadCategories.and.returnValue(of([]));
    apiService.getMissedCategories.and.returnValue(of([]));
    apiService.getFalsePositiveCategories.and.returnValue(of([]));
    apiService.getFalseNegativeCategories.and.returnValue(of([]));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
