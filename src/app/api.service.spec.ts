import { TestBed } from '@angular/core/testing';
import { IApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { ODataApiService } from './oDataApi.service';

describe('IApiService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EnvironmentService, useValue: { config: { apiUrl: 'http://example.com' }}}
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: IApiService = TestBed.get(ODataApiService);
    expect(service).toBeTruthy();
  });
});
