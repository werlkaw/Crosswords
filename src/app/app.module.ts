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
import { DatePipe } from '@angular/common';
import { TopbarComponent } from './components/topbar/topbar.component';

import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutes } from './app.routes';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CrosswordComponent,
    TableComponent,
    HintsComponent,
    TopbarComponent,
    LoginComponent,
    HomeComponent,
    SideMenuComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'crosswords'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutes,
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
