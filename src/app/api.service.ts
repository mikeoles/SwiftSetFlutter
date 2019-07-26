import Mission from './mission.model';
import Aisle from './aisle.model';
import { Observable } from 'rxjs';
import MissionSummary from './missionSummary.model';
import Store from './store.model';
import { EnvironmentService } from './environment.service';
import { StaticApiService } from './staticApi.service';
import { ODataApiService } from './oDataApi.service';
import { HttpClient } from '@angular/common/http';

export interface ApiService {
  getStores();
  getStore(storeId: number, startDate: Date, timezone: String): Observable<Store>;
  getRangeMissionSummaries(startDate: Date, endDate: Date, storeId: number, timezone: string): Observable<MissionSummary[]>;
  getRangeAisles(startDate: Date, endDate: Date, storeId: number, timezone: string): Observable<Aisle[]>;
  getMissionSummaries(date: Date, storeId: number, timezone: string): Observable<MissionSummary[]>;
  getMissionSummary(storeId: number, mission: number): Observable<MissionSummary>;
  getMissions(storeId: number): Observable<Mission[]> ;
  getMission(storeId: number, missionId: number): Observable<Mission>;
  getAisles(storeId: number, missionId: number): Observable<Aisle[]>;
  getAisle(storeId: number, missionId: number, aisleId: number): Observable<Aisle>;

}

export function apiFactory(environment: EnvironmentService, http: HttpClient) {

  if (environment.config.apiType === 'odata') {
    return new ODataApiService(http, environment);
  } else {
    return new StaticApiService(http, environment);
  }
}
