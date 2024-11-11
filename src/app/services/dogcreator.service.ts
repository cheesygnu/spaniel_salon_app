import {Injectable} from "@angular/core";
import { Firestore, addDoc, collection, getDoc, getDocs, query, doc, updateDoc, setDoc, CollectionReference, getDocFromServer, where } from '@angular/fire/firestore';
import { DOGGIES } from "../shared/mock-dogs";
import { DOGGIEOWNERS } from "../shared/mock-owners";
import { Dog } from "../models/dog.model";
import { DogOwner } from "../models/dog-owner.model";
import { getFirestore } from "firebase/firestore";

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
    if(!newDog.mappedOwner){
      newDog.mappedOwner = await this.getNextNumber("nextOwnerNumber");
    }

    newDog.dogid = await this.getNextNumber("nextDogNumber");
    const dogidStr = newDog.dogid.toString().padStart(4,'0');
    console.log("createDog function. newDog.name: ", newDog.dogname, "  newDog.name shortened: ", newDog.dogname.substring(0,30));
    //this.getNextDogNumber();

    const docName = newDog.dogname.concat("-",dogidStr); // ("-",newDog.owner.ownerFirstName,"-",newDog.owner.ownerSurname,"-",dogidStr);
    const docRef = await setDoc(doc(this.firestore, 'dogs', docName), {
      //dogname: newDog.dogname
      ...newDog

    });
    await this.incrNextNumber("nextDogNumber", newDog.dogid);
    await this.incrNextNumber("nextOwnerNumber", newDog.mappedOwner);
  }

  async getNextNumber(indexName: string) {
    const nextDocRef = doc(this.firestore, "uniqueIdentifiers", indexName);
    const docSnap = await getDoc(nextDocRef);
    const docNumber = docSnap.data()?.['docNumber'];
    console.log("Retrieved docNumber: ", docNumber);
    return docNumber;
  }

  async incrNextNumber(indexName:string, curNum: number) {
    curNum++;
    const nextDocRef = doc(this.firestore,"uniqueIdentifiers", indexName);
    await setDoc(nextDocRef, {
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

  getDogs() {
    console.log("DogCreatorService: Getting list of dogs");
    return getDocs(query(collection(this.firestore, 'dogs')))
      .then((querySnapshot) => {
        const storedDogs: Dog[] = querySnapshot.docs.map((dogDoc) => dogDoc.data() as Dog);
        console.log("Stored Dogs: ", storedDogs);
        return storedDogs;
      });
  }

  getDog(id: number) {
    return getDocs(query(collection(this.firestore, 'dogs')))
      .then((querySnapshot) => {
        const storedDog: Dog[] = querySnapshot.docs.map((dogDoc) => dogDoc.data() as Dog);
        return storedDog.filter(dog => dog.dogid === id)[0];
      });
  }

  async getDogOwner(ownerid:number) {
    return getDocs(query(collection(this.firestore, 'owners')))
      .then((querySnapshot) => {
        const storedDogOwner: DogOwner[] = querySnapshot.docs.map((dogOwnerDoc) => dogOwnerDoc.data() as DogOwner);
        return storedDogOwner.filter(dogOwner => dogOwner.ownerid === ownerid)[0];
      });
  }

    /*
    const ownerRef = collection(this.firestore, 'owners');
    const ownerDoc = query(ownerRef, where("ownerid", "==", ownerid));
    const ownerSnapshot = await getDocs(ownerDoc);
    const owner = ownerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
    console.log("Retrieved Owner: ", owner);
    return owner; /*




    /*const nextDogDocRef = doc(this.firestore, "owners",);
    const docSnap = await getDoc(nextDogDocRef);
    const docNumber = docSnap.data()?.['docNumber'];
    console.log("Retrieved docNumber: ", docNumber);
    return docNumber;*/
    //console.log("DogCreatorService: Getting list of owners");
    //return Promise.resolve (DOGGIEOWNERS);

}
