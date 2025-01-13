//import { DogOwner } from "./dog-owner.model";
export class DogAndOwner {
  dogid!: number;
  dogname!: string;
  owner!: number;
  ownerName!: string; // To be populated from dog-owner wehn resolved against the ownerid contained in owner field

}
