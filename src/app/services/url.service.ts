import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  public get location(): Location {
    return this.document.location;
  }
}
