import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { CrosswordComponent } from './components/crossword/crossword.component';
import { TableComponent } from './components/table/table.component';
import { HintsComponent } from './components/hints/hints.component';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';

const appRoutes: Routes = [
  { path: '', component: CrosswordComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    CrosswordComponent,
    TableComponent,
    HintsComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'crosswords'),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
