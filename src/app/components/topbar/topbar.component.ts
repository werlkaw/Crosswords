import { Component, OnInit } from '@angular/core';
import { HtmlHelperService } from 'src/app/services/html-helper.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PathConstants } from 'src/app/constants/PathConstants';
import { FirebaseUserService } from 'src/app/services/auth/firebase-user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  public currentHint: string = ""
  constructor(private htmlHelper: HtmlHelperService, private _router: Router,
              public firebaseUser: FirebaseUserService) { }

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
