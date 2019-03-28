import { NgModule } from '@angular/core';
import {MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatToolbarModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatToolbarModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatToolbarModule
  ],
})
export class MaterialModule { }