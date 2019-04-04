import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlHelperService {
  public runAfterRender(f: () => void): any {
    setTimeout(() => {
      f()
    }, 100)
  }

  constructor() { }

  public isMobile() {
    return window.innerWidth < 600
  }
}
