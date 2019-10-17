import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Permissions } from 'src/permissions/permissions';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private appConfig;

  constructor(private injector: Injector) { }

  loadAppConfig() {
    const http = this.injector.get(HttpClient);

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
