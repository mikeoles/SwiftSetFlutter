import { Injectable, Injector, Type } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Permissions } from 'src/permissions/permissions';

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

  setPermissions(permissions: Permissions[]) {
    this.appConfig.permissions = permissions;
  }
}
