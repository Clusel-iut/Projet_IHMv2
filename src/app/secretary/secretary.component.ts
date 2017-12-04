import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CabinetMedicalService} from "../cabinet-medical.service";
import {CabinetInterface} from "../dataInterfaces/cabinet";
import {InfirmierInterface} from "../dataInterfaces/nurse";
import {PatientInterface} from "../dataInterfaces/patient";

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SecretaryComponent implements OnInit {

  private cabinet : CabinetInterface;
  private cs : CabinetMedicalService;

 constructor(cs : CabinetMedicalService) {
   this.cs = cs;
   cs.getData("/data/cabinetInfirmier.xml").then(
     cabinet => this.cabinet = cabinet)
 }

  ngOnInit() {
  }

  public getInfirmiers(): InfirmierInterface[] {
      return this.cabinet?this.cabinet.infirmiers:[];
  }

  public getPatientsNonAffectes(): PatientInterface[] {
    return this.cabinet?this.cabinet.patientsNonAffectés:[];
  }

  public getPatientsAffectes(): PatientInterface[] {
    return this.cabinet?this.cabinet.patientsAffectés:[];
  }

  public creatPatient(nom: string, prenom: string,numsec: string, sexe: string, dateNaiss: string, etage: string,
                      numero: string, rue: string, cp: number, ville: string): void {
    this.cs.creatPatient(nom, prenom,numsec, sexe, dateNaiss, etage, numero, rue, cp, ville);
  }

  public affectPatient(infId: string, numsecu: string): void {
    console.log("passage 1");
    this.cs.affectPatient(infId, numsecu);
  }

  public desaffectPatient(numesecu: string): void {
    this.cs.desaffectPatient(numesecu);
  }

  /*public getCabinetLng() : number
  {
    return this.cabinet.adresse.lng;
  }

  public getCabinetLat() : number
  {
    return this.cabinet.adresse.lat;
  }*/
}
