import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import outs from './mock/outs.json';
import labels from './mock/labels.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getPanoramaUrl(selectedMission: number, selectedAisle: string): Observable<string> {
    return of('assets/aisle.jpg');
  }

  getOuts(selectedMission: number, selectedAisle: string): Observable<Array<any>> {
    return of(outs);
  }

  getLabels(selectedMission: number, selectedAisle: string): Observable<Array<any>> {
    return of(labels);
  }

  getMissions(): Observable<Array<any>> {
    return of(outs);
  }

  getAisles(selectedMission: number): Observable<Array<any>> {
    return of(labels);
  }
}
