import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackService implements OnDestroy {
  private subject: Subject<Object> = new Subject<Object>();

  constructor() { }

  ngOnDestroy() {
    this.subject.complete();
  }

  backClickEvent(): Observable<Object> {
    return this.subject.asObservable();
  }

  backClick() {
    this.subject.next(null);
  }
}
