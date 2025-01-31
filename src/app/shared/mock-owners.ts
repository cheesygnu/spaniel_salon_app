import { DogOwner } from "../models/dog-owner.model";
import { Dog } from "../models/dog.model";
import { UNASSIGNED_ID } from "./constants";
import { OwnerContactDetails } from "../models/owner-contact-details.model";
import { ContactPhone } from "../models/contact-phone.model";
import { ContactEmail } from "../models/contact-email.model";

 //let ownerVanessa1:ContactDetails;

/*export const ownerVanessa1: OneContactDetails[] =[
  {contactAddress: 'v@com', contactMethod: 3}
];*/

export const DOGGIEOWNERS: DogOwner[] = [
  { ownerid: 1, ownerSurname: 'Beer', ownerFirstName: 'Vanessa', ownerContactDetails: { contactPhoneNumbers: [{ phoneType: 'mobile', phoneNumber: '0777123123' }, { phoneType: 'landline', phoneNumber: '01905 4221188' }], contactEmailAddresses: [] } },
  { ownerid: 2, ownerSurname: 'The Menace', ownerFirstName: 'Dennis', ownerContactDetails: { contactPhoneNumbers: [{ phoneType: 'mobile', phoneNumber: '0777123400' }], contactEmailAddresses: [] } },
  { ownerid: 3, ownerSurname: 'The Softy', ownerFirstName: 'Walter', ownerContactDetails: { contactPhoneNumbers: [{ phoneType: 'mobile', phoneNumber: '0777123505' }], contactEmailAddresses: [] } },
  { ownerid: 3, ownerSurname: 'The Reporter', ownerFirstName: 'Tintin', ownerContactDetails: { contactPhoneNumbers: [{ phoneType: 'mobile', phoneNumber: '0777123606' }], contactEmailAddresses: [] } },

];

export const BLANK_OWNER: DogOwner = {
  ownerid: UNASSIGNED_ID,
  ownerSurname: '',
  ownerFirstName: '',
  ownerContactDetails: {
    contactPhoneNumbers: [],
    contactEmailAddresses: []
  } as OwnerContactDetails
}

export const ERROR_OWNER: DogOwner = {
  ownerid: UNASSIGNED_ID,
  ownerFirstName: 'ERROR',
  ownerSurname: 'ERROR',
  ownerContactDetails: {
    contactPhoneNumbers: [],
    contactEmailAddresses: []
  } as OwnerContactDetails
}
