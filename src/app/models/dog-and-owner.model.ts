import { Dog } from "./dog.model";
export interface DogAndOwner extends Dog{
  ownerName: string; // To be populated from dog-owner when resolved against the ownerid contained in owner field

}
