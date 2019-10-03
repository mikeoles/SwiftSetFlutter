import Mission from './mission.model';
import Aisle from './aisle.model';
import { Observable } from 'rxjs';
import Store from './store.model';
import { EnvironmentService } from './environment.service';
import { CloudApiService } from './cloudApi.service';
import { HttpClient } from '@angular/common/http';

export interface ApiService {
  getStores();
  getStore(storeId: string, startDate: Date, endDate: Date): Observable<Store>;
  getMissions(storeId: string, startDate: Date, endDate: Date, timezone: string): Observable<Mission[]> ;
  getMission(storeId: string, missionId: string, timezone: string): Observable<Mission>;
  getAisle(storeId: string, missionId: string, aisleId: string): Observable<Aisle>;
  getHistorialData(startDate: Date, endDate: Date);
  getTokens(accessCode: string): any;
  getRoles(idToken: string): Observable<string>;
}

export function apiFactory(environment: EnvironmentService, http: HttpClient) {
  return new CloudApiService(http, environment);
}
