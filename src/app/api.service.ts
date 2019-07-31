import Mission from './mission.model';
import Aisle from './aisle.model';
import { Observable } from 'rxjs';
import Store from './store.model';
import { EnvironmentService } from './environment.service';
import { StaticApiService } from './staticApi.service';
import { CloudApiService } from './cloudApi.service';
import { HttpClient } from '@angular/common/http';

export interface ApiService {
  getStores();
  getStore(storeId: string, startDate: Date, endDate: Date): Observable<Store>;
  getMissions(storeId: string, startDate: Date, endDate: Date): Observable<Mission[]> ;
  getMission(storeId: string, missionId: string): Observable<Mission>;
  getAisle(storeId: string, missionId: string, aisleId: string): Observable<Aisle>;
}

export function apiFactory(environment: EnvironmentService, http: HttpClient) {

  if (environment.config.apiType === 'cloud') {
    return new CloudApiService(http, environment);
  } else {
    return new StaticApiService(http, environment);
  }
}
