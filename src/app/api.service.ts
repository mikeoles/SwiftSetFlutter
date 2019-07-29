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
  getStore(storeId: string, startDate: Date, endDate: Date): Observable<Store>;
  // Replaced by getMissions which takes in a range of dates and returns all the data from mission summaries as missions
  getRangeMissionSummaries(startDate: Date, endDate: Date, storeId: string, timezone: string): Observable<MissionSummary[]>;
  // Replaced by getMission which has a list of aisles in it and can be filtered by a start and end date
  getRangeAisles(startDate: Date, endDate: Date, storeId: string, timezone: string): Observable<Aisle[]>;
  // Replaced by getMissions which takes in a range of dates and returns all the data from mission summaries as missions
  getMissionSummaries(date: Date, storeId: string, timezone: string): Observable<MissionSummary[]>;
  // Replaced by get Missions because missions have the data of missionSummaries
  getMissionSummary(storeId: string, mission: number): Observable<MissionSummary>;
  getMissions(storeId: string): Observable<Mission[]> ;
  getMission(storeId: string, missionId: number): Observable<Mission>;
  // Replaced by getMission which has a list of aisles in it
  getAisles(storeId: string, missionId: number): Observable<Aisle[]>;
  getAisle(storeId: string, missionId: number, aisleId: number): Observable<Aisle>;

}

export function apiFactory(environment: EnvironmentService, http: HttpClient) {

  if (environment.config.apiType === 'odata') {
    return new ODataApiService(http, environment);
  } else {
    return new StaticApiService(http, environment);
  }
}
