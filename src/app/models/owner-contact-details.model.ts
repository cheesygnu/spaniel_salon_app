import { ContactPhone } from "./contact-phone.model";
import { ContactEmail } from "./contact-email.model";

export class OwnerContactDetails {
  contactPhoneNumbers!: ContactPhone[];
  contactEmailAddresses!: ContactEmail[];
}
