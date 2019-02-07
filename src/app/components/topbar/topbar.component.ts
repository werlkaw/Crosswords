import { Component, OnInit } from '@angular/core';
import { HtmlHelperService } from 'src/app/services/html-helper.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  public currentHint: string = ""
  constructor(private htmlHelper: HtmlHelperService) { }

  ngOnInit() {
  }

  public updateHint(hint: string) {
    this.currentHint = hint
  }

  public showTopNavText() {
    if (this.htmlHelper.isMobile() && this.currentHint) {
      return this.currentHint
    } else {
      return "CrossWithFriends"
    }
  }
}
