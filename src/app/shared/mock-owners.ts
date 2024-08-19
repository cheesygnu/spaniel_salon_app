import { OneContactDetails } from "../models/one-contact-details.model";
import { DogOwner } from "../models/dog-owner.model";
import { Dog } from "../models/dog.model";

 //let ownerVanessa1:ContactDetails;

/*export const ownerVanessa1: OneContactDetails[] =[
  {contactAddress: 'v@com', contactMethod: 3}
];*/

export const DOGGIEOWNERS: DogOwner[] = [
  { ownerid: 1, ownerSurname: 'Beer', ownerFirstName: 'Vanessa', ownerContactDetails: 'v@com' },
  { ownerid: 2, ownerSurname: 'The Menace', ownerFirstName: 'Dennis', ownerContactDetails: 'd@com' },
  { ownerid: 3, ownerSurname: 'The Softy', ownerFirstName: 'Walter', ownerContactDetails: 'w@com' },
  { ownerid: 3, ownerSurname: '', ownerFirstName: 'Tintin', ownerContactDetails: 't@com' },
  /*{ dogid: 2, dogname: 'Tod', owner: 'Vanessa Beer' },
  { dogid: 3, dogname: 'Gnasher', owner: 'Denis The Menace' },
  { dogid: 4, dogname: 'Fido', owner: 'Walter The Softy' },
  { dogid: 5, dogname: 'Snowy', owner: 'Tintin' },*/
];


