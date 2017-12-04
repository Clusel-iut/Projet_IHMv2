import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
//import {DragDropModule} from 'alx-dragdrop';
//import {AgmCoreModule} from '@agm/core';

import { AppComponent } from './app.component';
import { CabinetMedicalService } from './cabinet-medical.service';
import { SecretaryComponent } from './secretary/secretary.component';

import {HttpModule} from '@angular/http';
import { InfirmierComponent } from './infirmier/infirmier.component';
import { PatientComponent } from './patient/patient.component'

@NgModule({
  declarations: [
    AppComponent,
    SecretaryComponent,
    InfirmierComponent,
    PatientComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    //DragDropModule,
    /*AgmCoreModule.forRoot({
      apiKey:  "AIzaSyC6BL-XAVUgZlANlGtuKhU3wVWntslalYg"
    }),*/
    HttpModule
  ],
  providers: [CabinetMedicalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
