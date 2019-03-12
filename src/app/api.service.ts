import Mission from './mission.model';
import Aisle from './aisle.model';
import { Observable } from 'rxjs';
import MissionSummary from './missionSummary.model';
import Store from './store.model';

export interface IApiService {
  getStores();
  getStore(storeId: number, startDate: Date, timezone: String): Observable<Store>;
  getMissionSummaries(date: Date, storeId: number, timezone: string): Observable<MissionSummary[]>;
  getMissionSummary(storeId: number, mission: number): Observable<MissionSummary>;
  getMissions(storeId: number): Observable<Mission[]> ;
  getMission(storeId: number, missionId: number): Observable<Mission>;
  getAisles(storeId: number, missionId: number): Observable<Aisle[]>;
  getAisle(storeId: number, missionId: number, aisleId: number): Observable<Aisle>;
}
