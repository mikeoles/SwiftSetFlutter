import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import outs from './mock/outs.json';
import labels from './mock/labels.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getOuts(): Observable<Array<any>> {
    return of(outs);
  }

  getLabels(): Observable<Array<any>> {
    return of(labels);
  }
}
