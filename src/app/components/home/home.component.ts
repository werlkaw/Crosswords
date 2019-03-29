import { Component, OnInit, ViewChild } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('topbar') topbar: TopbarComponent
  constructor() { }

  ngOnInit() {
  }

  fillTopBarHint(hint: string) {
    this.topbar.updateHint(hint)
  }
}
