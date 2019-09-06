import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { CloudApiService } from './cloudApi.service';
import { AdalService } from 'adal-angular4';

describe('ApiService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EnvironmentService, useValue: { config: { apiUrl: 'http://example.com', coverageDisplayType: 'description' }}},
        { provide: AdalService }
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: ApiService = TestBed.get(CloudApiService);
    expect(service).toBeTruthy();
  });
});
