import { Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {PatientInterface} from "../dataInterfaces/patient";

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit {

  @Input("data") private patient : PatientInterface;

  constructor() {

  }
  public getNom():string{
    return this.patient.nom;
  }
  ngOnInit() {
  }

}
