import {Http} from "@angular/http";
import {CabinetInterface} from "./dataInterfaces/cabinet";
import {Adresse} from "./dataInterfaces/adress";
import {PatientInterface} from "./dataInterfaces/patient";
import {sexeEnum} from "./dataInterfaces/sexe";
import {InfirmierInterface} from "./dataInterfaces/nurse";
//import {MapsAPILoader} from "@agm/core";
//import {} from '@types/googlemaps';
import {log} from "util";
import {Injectable} from "@angular/core";

@Injectable()
export class CabinetMedicalService {

 // private Pgapi: Promise<any>; // Indique quand l’API est disponible
  //private geocoder: google.maps.Geocoder;

  constructor(private _http: Http) {
  }

  /*constructor(private _http: Http, mapsAPILoader: MapsAPILoader) {
    this.Pgapi = mapsAPILoader.load().then(() => {
      console.log('google script loaded');
      this.geocoder = new google.maps.Geocoder();
    } );
  }*/

  getData(url: string): Promise<CabinetInterface> {

    return this._http.get(url).toPromise().then(res=> {
      console.log(url, "=>", res);
      const text = res.text();

      //RECONSTRUIRE LE DOC XML (DOMPARSER)
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");
      const infirmiersXML : Element[] = Array.from(doc.querySelectorAll("infirmier"));
      const patientsXML : Element[] = Array.from(doc.querySelectorAll("patient"));

      const allPatient = patientsXML.map(infXML => { return {
        prénom: infXML.querySelector("prénom").textContent,
        nom: infXML.querySelector("nom").textContent,
        sexe: (infXML.querySelector("sexe").textContent === "M") ? sexeEnum.M : sexeEnum.F,
        numeroSecuriteSociale: infXML.querySelector("numéro").textContent,
        adresse : this.getAdresseFrom(doc.querySelector("patient > adresse"))
      }});

      //A PARTIR DE CE DOC, CONSTRUIRE LE CABINET
      const cabinet: CabinetInterface = {
        infirmiers: infirmiersXML.map(infXML => { return {
          id : infXML.getAttribute("id"),
          prénom : infXML.querySelector("prénom").textContent,
          nom : infXML.querySelector("nom").textContent,
          photo : infXML.querySelector("photo").textContent,
          patients : [],
          adresse : this.getAdresseFrom(doc.querySelector("infirmier > adresse"))
        }}),

        patientsNonAffectés: [],

        patientsAffectés: [],

        patients : [],

        adresse :  this.getAdresseFrom(doc.querySelector("cabinet > adresse"))
      };

      const affectations = patientsXML.map(patientXML => {
        const idP = patientXML.querySelector('numéro').textContent;
        const patient = allPatient.find(p => p.numeroSecuriteSociale === idP);
        const intervenant = patientXML.querySelector("visite").getAttribute("intervenant");
        const infirmier = cabinet.infirmiers.find(i => i.id === intervenant);

        return {
          infirmier : infirmier,
          patient : patient
        }
      });

      affectations.forEach(A => {
        if (A.infirmier)  {
          A.infirmier.patients.push(A.patient);
          cabinet.patientsAffectés.push(A.patient);
          cabinet.patients.push(A.patient);
        } else {
          cabinet.patientsNonAffectés.push(A.patient);
          cabinet.patients.push(A.patient);
        }
      });

      return cabinet;
    })
  }

  public getAdresseFrom(addXML: Element): Adresse {

    let node : Element;

    return {

      numéro : (node=addXML.querySelector("numéro")) ? node.textContent : "",
      ville : addXML.querySelector("ville").textContent,
      codePostal : parseInt(addXML.querySelector("codePostal").textContent, 10),
      rue : addXML.querySelector("rue").textContent,

      étage : (node=addXML.querySelector("étage")) ? node.textContent : "",

      lat : undefined,
      lng : undefined

  };
  }

  public creatPatient(nom: string, prenom: string,numsec: string, sexe: string, dateNaiss: string, etage: string,
                      numero: string, rue: string, cp: number, ville: string): void
  {
    const adressPat : Adresse = {
      ville: ville,
      codePostal: cp,
      rue: rue,
      numéro: numero,
      étage: etage,
      lat: null,
      lng: null
    };

    const nouveauPatient : PatientInterface = {
      prénom : prenom,
      nom : nom,
      sexe : sexe.localeCompare('M') == 0? sexeEnum.M : sexeEnum.F,
      numeroSecuriteSociale : numsec,
      adresse : adressPat
    };

      this.addPatient(nouveauPatient, dateNaiss);
  }

  public addPatient(patient: PatientInterface, dateNaiss: string): void
  {
      this._http.post("/addPatient", {
      patientName: patient.nom,
      patientForname: patient.prénom,
      patientNumber: patient.numeroSecuriteSociale,
      patientSex: patient.sexe === sexeEnum.M ? "M" : "F",
      patientBirthday: dateNaiss,
      patientFloor: patient.adresse.étage,
      patientStreetNumber: patient.adresse.numéro,
      patientStreet: patient.adresse.rue,
      patientPostalCode: patient.adresse.codePostal,
      patientCity: patient.adresse.ville
    }).toPromise().then(
        res => console.log(res),
        err => console.error(err)
      );
  }

  public affectPatient(infirmierId: string, numSecuriteSociale: string): void {

    this._http.post( "/affectation", {
      infirmier: infirmierId,
      patient: numSecuriteSociale
    }).toPromise().then(
      res => console.log(res),
      err => console.error(err)
    );

  }

  public desaffectPatient(numesecu: string): void {
    this._http.post( "/affectation", {
      infirmier: "none",
      patient: numesecu
    }).toPromise().then(
      res => console.log(res),
      err => console.error(err)
    );
  }

  /*private getLatLngFor( adressables: {adresse: Adresse}[] ) {
    adressables = adressables.slice(); // Copie pour éviter problèmes récursions
    this.Pgapi.then( () => {
      if (adressables.length) {
        const itemWithAdress = adressables.pop();
        const A = itemWithAdress.adresse;
        const address = `${A.numéro} ${A.rue}, ${A.codePostal} ${A.ville}`;
        this.geocoder.geocode({address}, (res, status) => {
          // console.log(itemWithAdress, "=>", status, res);
          if (status === google.maps.GeocoderStatus.OK) {
            const place = res[0].geometry.location;
            itemWithAdress.adresse.lat = place.lat();
            itemWithAdress.adresse.lng = place.lng();
            console.log( itemWithAdress.adresse );
          }
          switch (status) {
            case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
              adressables.push(itemWithAdress);
              this.getLatLngFor(adressables);
              break;
            default:
              this.getLatLngFor(adressables);
          }
        });
      }
    });
  }

  mapReady(map: google.maps.Map) {
   console.log("mapReady", map);
   map.addListener("click", evt => {
   this.getAdresseFromLatLng( evt.latLng );
   });
   }

   async getAdresseFromLatLng(latLng: google.maps.LatLng): Promise<Adresse> {
   function getCompValue(comps: google.maps.GeocoderAddressComponent[], name: string): string {
   const comp = comps.find( c => c.types.indexOf(name) >= 0 );
   return comp ? comp.long_name : "";
   }

   await this.Pgapi;
   return new Promise<Adresse>( (resolve, reject) => {
   this.geocoder.geocode( {location: latLng}, (res, status) => {
   console.log(latLng, status, res);
   if (status === google.maps.GeocoderStatus.OK) {
   const comps: google.maps.GeocoderAddressComponent[] = res[0].address_components;
   const ad: Adresse = {
   ville: getCompValue(comps, "locality"),
   codePostal: parseInt( getCompValue(comps, "postal_code"), 10),
   rue: getCompValue(comps, "route"),
   numéro: getCompValue(comps, "street_number"),
   étage: "",
   lat: latLng.lat(),
   lng: latLng.lng()
   };
   resolve(ad);
   } else {reject(status);}
   });
   });
   }
*/
}

type AFFECTATION =
  {
    patient : PatientInterface,
    infirmier : InfirmierInterface
  };
