import { ContactDetails } from "./contact-details.model";

export class DogOwner {
  ownerid!: number;
  ownerSurname!: string;
  ownerFirstName!: string;
  ownerContactDetails!: [ContactDetails];
}
