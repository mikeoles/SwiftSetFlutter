import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import outs from './mock/outs.json';
import labels from './mock/labels.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {
    let x = labels[0].X1;
    let y = labels[0].Z1 + 1000;
    let id = Math.max(...labels.map(o => o.Id));

    for (id += 1; id <= 1200; id++) {
      x += 130;
      if (x > 18000) {
        x = labels[0].X1;
        y += 190;
      }
      labels.push({
        ...labels[0],
        Id: id,
        X1: x,
        Z1: y,
        X2: x + 100,
        Z2: y + 50,
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
