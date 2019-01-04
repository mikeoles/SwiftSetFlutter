import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import outs from './mock/outs.json';
import labels from './mock/labels.json';
import store from './mock/store.json';
import missions from './mock/missions.json';
import aisles from './mock/aisles.json';
import mission from './mock/mission.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getOuts(selectedAisle: string): Observable<Array<any>> {
    return of(outs);
  }

  getLabels(selectedAisle: string): Observable<Array<any>> {
    return of(labels);
  }

  getMissions(): Observable<Array<any>> {
    return of(outs);
  }

  getAisles(selectedMission: number): Observable<Array<any>> {
    return of(aisles);
  }

  getStore(id: number) {
    return of(store);
  }

  getDateMissions(date: string): Observable<Array<any>> {
    return of(missions);
  }

  getMission(missionId: number) {
    return of(mission);
  }
}
