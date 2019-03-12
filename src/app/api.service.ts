import Mission from './mission.model';
import Aisle from './aisle.model';
import { Observable } from 'rxjs';
import MissionSummary from './missionSummary.model';
import Store from './store.model';

export interface IApiService {
  getStore(storeId: string, startDate: Date, timezone: String): Observable<Store>;
  getMissionSummaries(date: Date, storeId: string, timezone: string): Observable<MissionSummary[]>;
  getMissionSummary(mission: number): Observable<MissionSummary>;
  getMissions(): Observable<Mission[]> ;
  getMission(missionId: number): Observable<Mission>;
  getAisles(missionId: number): Observable<Aisle[]>;
  getAisle(aisleId: number): Observable<Aisle>;
}
