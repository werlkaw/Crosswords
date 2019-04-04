import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlHelperService {

  constructor() { }

  public isMobile() {
    return window.innerWidth < 600
  }
}
