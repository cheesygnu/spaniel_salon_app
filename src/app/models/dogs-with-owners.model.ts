import { Dog } from "./dog.model";
import { DogOwner } from "./dog-owner.model";

export interface DogsWithOwner{ // used for importing in a record of an owner and their dogs
  owner: DogOwner;
  dogs: Dog[];
}




