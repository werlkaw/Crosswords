import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { CrosswordComponent } from './components/crossword/crossword.component';
import { TableComponent } from './components/table/table.component';
import { HintsComponent } from './components/hints/hints.component';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TopbarComponent } from './components/topbar/topbar.component';

import { MaterialModule } from './material.module';

const appRoutes: Routes = [
  { path: '', component: CrosswordComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    CrosswordComponent,
    TableComponent,
    HintsComponent,
    TopbarComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'crosswords'),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
