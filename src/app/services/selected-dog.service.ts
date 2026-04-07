import { computed, Injectable, signal } from '@angular/core';
import { Dog } from '../models/dog.model';
import { ERROR_DOG } from '../shared/mock-dogs';
import { DogAndOwner } from '../models/dog-and-owner.model';

@Injectable({
  providedIn: 'root',
})
export class SelectedDog {
  // Retrieve the stored value of lastViwedDogId which is either a string or null, and if string exists convert it to a number
  //selectedDogId = signal<number>(localStorage.getItem('lastViewedDogId') ? Number(localStorage.getItem('lastViewedDogId')) : ERROR_DOG.dogid);
  selectedDog = signal<Dog>(ERROR_DOG);
  selectedDogId = computed(() =>this.selectedDog().dogid);


  storeSelectedDog(dog: Dog) {
    //this.selectedDogId.set(dog.dogid);
    this.selectedDog.set(dog);
    localStorage.setItem('lastViewedDogId', dog.dogid.toString());
    console.log("Storing SELECTED DOG ... ", dog.dogname);
    console.log("Storing SELECTED DOG ID ... ", dog.dogid.toString());
    console.log("SELECTED DOG ID (signal)... ", this.selectedDogId());
  }

  retrieveSelectedDog() {
    return this.selectedDog();
  }

}
