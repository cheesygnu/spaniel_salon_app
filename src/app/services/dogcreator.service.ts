import {Injectable} from "@angular/core";
import { Firestore, addDoc, collection, getDocs, query } from '@angular/fire/firestore';
import { DOGGIES } from "../shared/mock-dogs";
import { DOGGIEOWNERS } from "../shared/mock-owners";
import { Dog } from "../models/dog.model";

@Injectable({
   providedIn: 'root'
})

export class DogCreatorService {

  constructor(public firestore: Firestore) { }

  async createDog(newDog: Dog) {
    const docRef = await addDoc(collection(this.firestore, 'dogs'), {
      dog: newDog
    });
    console.log("Document written with ID: ", docRef.id);
  }

  getDogs() {
    console.log("DogCreatorService: Getting list of dogs");
    return Promise.resolve (DOGGIES);
  }
  getDog(id: number){
    return Promise.resolve (DOGGIES).then(
      dogs => dogs.filter(dog=> dog.dogid === id)[0]
    );
  }
  getDogOwners() {
    console.log("DogCreatorService: Getting list of owners");
    return Promise.resolve (DOGGIEOWNERS);
  }
}
