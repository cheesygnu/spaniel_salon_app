import { Dog } from "./dog.model";
export class DogAndOwner {
  /*dogid!: number;
  dogname!: string;
  owner!: number; */
  dog!: Dog;
  ownerName!: string; // To be populated from dog-owner when resolved against the ownerid contained in owner field

}
