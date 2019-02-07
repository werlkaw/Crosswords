import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlHelperService {

  constructor() { }

  /* Returns the x and y coordinates of an HTML element. */
  private getPosition(el) {
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
  }

  public placeAbove(mainElement, topElement) {
    if (mainElement == null || topElement == null) {
      return
    }
    var mainCoordinates = this.getPosition(mainElement)
    mainCoordinates.y -= topElement.offsetHeight

    topElement.style.left = mainCoordinates.x + "px"
    topElement.style.top = mainCoordinates.y + "px"
  }

  public isMobile() {
    return window.innerWidth < 600
  }
}
