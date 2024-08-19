import { ContactDetails } from "../models/contact-details.model";
import { DogOwner } from "../models/dog-owner.model";
import { Dog } from "../models/dog.model";

 //let ownerVanessa1:ContactDetails;
 const ownerVanessa1:ContactDetails;
 ownerVanessa1.contactAddress = "v@com"

export const DOGGIEOWNERS: DogOwner[] = [
  { ownerid: 1, ownerSurname: 'Beer', ownerFirstName: 'Vanessa', ownerContactDetails:{ownerVanessa1},
  /*{ dogid: 2, dogname: 'Tod', owner: 'Vanessa Beer' },
  { dogid: 3, dogname: 'Gnasher', owner: 'Denis The Menace' },
  { dogid: 4, dogname: 'Fido', owner: 'Walter The Softy' },
  { dogid: 5, dogname: 'Snowy', owner: 'Tintin' },*/
];


