import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import AuthData from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  refreshing = false;
  refreshSubject = new BehaviorSubject<AuthData>(null);

  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't intercept auth requests
    if (this.isAuthRequest(req)) {
      return next.handle(req);
    }

    return next.handle(this.addAuthToken(req)).pipe(catchError(e => {
      if (e instanceof HttpErrorResponse && e.status === 401) {
        if (this.refreshing) {
          // If we are already refreshing, wait and re-call.
          return this.refreshSubject.pipe(
            filter(a => a != null),
            take(1),
            switchMap(_ => next.handle(this.addAuthToken(req)))
          );
        } else {
          // Refresh the token and re-call th endpoint
          this.refreshing = true;
          return this.authService.refresh().pipe(
            switchMap(a => {
              this.refreshing = false;
              this.refreshSubject.next(a);
              return next.handle(this.addAuthToken(req));
            }),
            catchError(() => {
              this.refreshing = false;
              this.authService.logout();
              return throwError(e);
            })
          );
        }
      }
      if (e instanceof HttpErrorResponse && e.status === 403) {
        window.location.href = 'unauthorized';
      }
      return throwError(e);
    }));
  }

  private isAuthRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/token');
  }

  private addAuthToken(req: HttpRequest<any>): HttpRequest<any> {
    const authData = this.authService.getAuthData();

    if (!authData) {
      return req;
    }
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authData.idToken}`)
    });
  }
}
