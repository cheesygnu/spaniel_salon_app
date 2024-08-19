import { OneContactDetails } from "./one-contact-details.model";

export class DogOwner {
  ownerid!: number;
  ownerSurname!: string;
  ownerFirstName!: string;
  ownerContactDetails!: string; //[OneContactDetails];
}
