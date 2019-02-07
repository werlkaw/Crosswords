import { Component, ViewChild } from '@angular/core';
import { TopbarComponent } from './components/topbar/topbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('topbar') topbar: TopbarComponent
  title = 'Crosswords'

  fillTopBarHint(hint: string) {
    this.topbar.updateHint(hint)
  }
}
