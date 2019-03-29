import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoService implements OnDestroy {
  private subject: Subject<Object> = new Subject<Object>();

  constructor() { }

  ngOnDestroy() {
    this.subject.complete();
  }

  logoClickEvent(): Observable<Object> {
    return this.subject.asObservable();
  }

  logoClick() {
    this.subject.next(null);
  }
}
