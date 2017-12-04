import {sexeEnum} from "./sexe";
import {Adresse} from "./adress";

export interface PatientInterface {
  prénom: string;
  nom: string;
  sexe: sexeEnum;
  numeroSecuriteSociale: string;
  adresse: Adresse;
}




