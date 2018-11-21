import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import outs from './mock/outs.json';
import labels from './mock/labels.json';
import missionSummaries from './mock/summaries.json';
import missions from './mock/missions.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getOuts(selectedMission: number, selectedAisle: string): Observable<Array<any>> {
    return of(outs);
  }

  getLabels(selectedMission: number, selectedAisle: string): Observable<Array<any>> {
    return of(labels);
  }

  getAllMissions(): Observable<Array<any>> {
    return of(outs);
  }

  getAisles(selectedMission: number): Observable<Array<any>> {
    return of(labels);
  }

  getMissionSummaries() {
    return of(missionSummaries);
  }

  getMissions(date: string): Observable<Array<any>> {
    return of(missions);
  }
}
