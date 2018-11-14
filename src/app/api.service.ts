import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import outs from './mock/outs.json';
import labels from './mock/labels.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {
    let x = outs[0].X1;
    let y = outs[0].Z1;
    let id = Math.max(...outs.map(o => o.Id));

    for (id += 1; id <= 500; id++) {
      x += 30;
      if (x > 2000) {
        x = outs[0].X1;
        y += 30;
      }
      outs.push({
        ...outs[0],
        Id: id,
        X1: x,
        Z1: y,
        X2: x + 10,
        Z2: y + 10,
      });
    }
  }

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
