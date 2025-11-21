import { Component } from '@angular/core';

import { Dog } from '../../models/dog.model';
import { UploadListComponent } from '../upload-list/upload-list.component';
import { DogCreatorService } from '../../services/dogcreator.service';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { Firestore, addDoc, collection, getDoc, getDocs, query, doc, updateDoc, setDoc, CollectionReference, getDocFromServer, onSnapshot, PersistenceSettings, PersistentCacheSettings, initializeFirestore, where } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';
import { DogAndOwner } from '../../models/dog-and-owner.model';
import { DogDetailsComponent } from '../dog-details/dog-details.component';
import { BLANK_DOG, ERROR_DOG } from '../../shared/mock-dogs';
import { SCREEN_SIZE_BREAKPOINT } from '../../shared/constants';

//import {dog2} from '../services/dogcreator.service';

@Component({
    selector: 'app-dogdirectory',
    imports: [RouterLink, DogDetailsComponent],
    templateUrl: './dogdirectory.component.html',
    styleUrl: './dogdirectory.component.css'
})
export class DogDirectoryComponent {
  // Get list of all the dogs

  allDogsInComponent: DogAndOwner[] = []; //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];
  nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length-1].dogid + 1 : 1;
  selectedDog: Dog = ERROR_DOG;
  editStatus: boolean = false;
  isSmallScreen: boolean = false;


  constructor(private dogcreator: DogCreatorService, private router: Router, public firestore: Firestore){
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    /*console.log("calling dogcreator");
    this.dogcreator.getDogs()
      .then(allDogs => this.allDogsInComponent = allDogs);*/

      const dogquery = query(collection(this.firestore, "dogs"), orderBy("dogname"));
      const dogQueryUnsubscribe = onSnapshot(dogquery, async (dogQuerySnapshot) => {
        this.allDogsInComponent = [];
        dogQuerySnapshot.forEach(async (dogdoc) => {
            this.allDogsInComponent.push(dogdoc.data() as DogAndOwner);
            this.allDogsInComponent[this.allDogsInComponent.length-1].ownerName = await this.getDogOwnerName(dogdoc.data()['mappedOwner']);
          }
        );
        console.log("! Stored Dogs: ",this.allDogsInComponent);
        this.selectedDog = (await this.dogcreator.getDog(this.allDogsInComponent[0].dogid)).storedDog;
        console.log("SELECTED DOG ",this.selectedDog);
      });


  }

  async getDogOwnerName(passedOwnerid: number): Promise<string> {
    let returnedOwnerName: string = "";
    console.log("ownerid is ", passedOwnerid);
    const querySnapshot = await getDocs(query(collection(this.firestore, 'owners'), where("ownerid", "==", passedOwnerid)));
    const ownerName = querySnapshot.docs.map((ownerDoc) => ownerDoc.data()['ownerFirstName'] + " " + ownerDoc.data()['ownerSurname']);
    returnedOwnerName = ownerName.length > 0 ? ownerName[0] : "";
    return returnedOwnerName;
  }

  createNewDog() {
    console.log('Creating New Dog');
    //this.nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length - 1].dogid + 1 : 1; //update nextDogId in case additional dogs have been added
    //this.router.navigate(['/details', this.nextDogId]);

    //this.router.navigate(['/details/new']);
    this.selectedDog = structuredClone(BLANK_DOG);
    this.editStatus = true;
  }

  async selectDog(dogAndOwner: DogAndOwner) {
    this.selectedDog = ((await this.dogcreator.getDog(dogAndOwner.dogid)).storedDog);
    this.editStatus = false;
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < SCREEN_SIZE_BREAKPOINT
  }
}
