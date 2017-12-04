import {PatientInterface} from "./patient";
import {Adresse} from "./adress";

export interface InfirmierInterface {
  id: string;
  prénom: string;
  nom: string;
  photo: string;
  patients: PatientInterface[];
  adresse: Adresse;
}
