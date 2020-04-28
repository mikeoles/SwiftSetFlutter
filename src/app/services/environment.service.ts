import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private appConfig;

  constructor(private handler: HttpBackend) { }

  loadAppConfig() {
    const http = new HttpClient(this.handler);

    return http.get('/assets/config.json')
    .toPromise()
    .then(data => {
      this.appConfig = {...environment, ...data };
    });
  }

  get config() {
      return this.appConfig;
  }
}
