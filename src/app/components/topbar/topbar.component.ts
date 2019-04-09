import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseUserService } from 'src/app/services/auth/firebase-user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  @Output() menuClick  = new EventEmitter()
  public gameTitle: string = "CrossWithFriends"
  constructor(public firebaseUser: FirebaseUserService) { }

  ngOnInit() {
  }
}
