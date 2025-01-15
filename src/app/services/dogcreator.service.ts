import {Injectable} from "@angular/core";
import { Firestore, addDoc, collection, getDoc, getDocs, query, doc, updateDoc, setDoc, CollectionReference, getDocFromServer, onSnapshot, PersistenceSettings, PersistentCacheSettings, initializeFirestore, where } from '@angular/fire/firestore';
import { DOGGIES } from "../shared/mock-dogs";
import { DOGGIEOWNERS } from "../shared/mock-owners";
import { Dog } from "../models/dog.model";
import { DogOwner } from "../models/dog-owner.model";
import { getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";

@Injectable({
   providedIn: 'root',
})


export class DogCreatorService {

  constructor(public firestore: Firestore) {

  }


  /*async createDog(newDog: Dog) {
    const docRef = await addDoc(collection(this.firestore, 'dogs'), {
      ...newDog // Spread all properties of the Dog object, rather than the Dog object itself
    });
    console.log("Document written with ID: ", docRef.id);
  }*/

  async createDog(newDog: Dog){
    //enries should be limited in html component, but also doing it here just for good practice.
    newDog.dogname = newDog.dogname.substring(0,30);
    //newDog.owner.ownerSurname = newDog.owner.ownerSurname.substring(0,30);
    //newDog.owner.ownerFirstName = newDog.owner.ownerFirstName.substring(0,30);
    newDog.dogid = await this.getNextDogNumber();
    const dogidStr = newDog.dogid.toString().padStart(4,'0');
    console.log("createDog function. newDog.name: ", newDog.dogname, "  newDog.name shortened: ", newDog.dogname.substring(0,30));
    //this.getNextDogNumber();

    const docName = newDog.dogname.concat("-","random","-",dogidStr);
    const docRef = await setDoc(doc(this.firestore, 'dogs', docName), {
      //dogname: newDog.dogname
      ...newDog

    });
    await this.incrNextDogNumber(newDog.dogid);
  }

  async getNextDogNumber() {
    const nextDogDocRef = doc(this.firestore,"nextDogNumber", "nextDogNumber");
    const docSnap = await getDoc(nextDogDocRef);
    const docNumber = docSnap.data()?.['docNumber'];
    console.log("Retrieved docNumber: ", docNumber);
    return docNumber;
  }

  async incrNextDogNumber(curNum: number) {
    curNum++;
    const nextDogDocRef = doc(this.firestore,"nextDogNumber", "nextDogNumber");
    await setDoc(nextDogDocRef, {
      docNumber: curNum
    });
    console.log("docNumber is now: ", curNum);
  }

  async modifyDog(existingDog: Dog) {
    const dogRef = doc(this.firestore, 'dogs', existingDog.dogid.toString());
    await updateDoc(dogRef, {
      ...existingDog
      // Add any other fields you want to modify here
    });
    console.log("Dog details updated for ID: ", existingDog.dogid);
  }

 /* async getOwner(passedOwnerid: number){
    /*console.log("getOwner function in dogscreator.service called with passedOwnerid", passedOwnerid);
    const querySnapshot = await getDocs(query(collection(this.firestore, 'owners'), where("ownerid", "==", passedOwnerid)));
    const returnedDogOwner = querySnapshot.docs.map((ownerDoc) => ownerDoc.data() as DogOwner);
    console.log("getOwner function in dogscreator.service returning ",returnedDogOwner);
    return returnedDogOwner;

    console.log("getOwner function in dogscreator.service called with passedOwnerid", passedOwnerid);
    return getDocs(query(collection(this.firestore, 'owners'), where("ownerid", "==", passedOwnerid)))
      .then((querySnapshot) => {
        const storedOwner: DogOwner[] = querySnapshot.docs.map((ownerDoc) => ownerDoc.data() as DogOwner);
        console.log("getOwner function in dogscreator.service returning ", storedOwner[0]);
        return storedOwner[0];
      });
  } */

  getDogs() {
    return new Promise<Dog[]>((resolve) => {
      const q = query(collection(this.firestore, "dogs"));
      onSnapshot(q, (querySnapshot) => {
        const storedDogs: Dog[] = [];
        querySnapshot.forEach((doc) => {
          storedDogs.push(doc.data() as Dog);
        });
        console.log("* Stored Dogs: ",storedDogs);
        resolve(storedDogs);
      });
    });
  }

  getDog(id: number) {
    return getDocs(query(collection(this.firestore, 'dogs')))
      .then((querySnapshot) => {
        const storedDog: Dog[] = querySnapshot.docs.map((dogDoc) => dogDoc.data() as Dog);
        return storedDog.filter(dog => dog.dogid === id)[0];
      });
  }

  getOwner(id: number) {
    console.log("getOwner function in dogscreator.service called with id", id);
    return getDocs(query(collection(this.firestore, 'owners')))
      .then((querySnapshot) => {
        const storedDog: DogOwner[] = querySnapshot.docs.map((dogDoc) => dogDoc.data() as DogOwner);
        return storedDog.filter(dog => dog.ownerid === id)[0];
      });
  }

  getDogOwners() {
    console.log("DogCreatorService: Getting list of owners");
    return Promise.resolve (DOGGIEOWNERS);
  }

  async createOwner(newOwner: DogOwner) {
    //newOwner = DOGGIEOWNERS[0];

    const docRef = await addDoc(collection(this.firestore, 'owners'), {
     ...newOwner
    });
  }

}
