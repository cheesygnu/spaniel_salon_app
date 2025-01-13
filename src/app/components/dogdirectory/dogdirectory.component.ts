import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../models/dog.model';
import { UploadListComponent } from '../upload-list/upload-list.component';
import { DogCreatorService } from '../../services/dogcreator.service';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { Firestore, addDoc, collection, getDoc, getDocs, query, doc, updateDoc, setDoc, CollectionReference, getDocFromServer, onSnapshot, PersistenceSettings, PersistentCacheSettings, initializeFirestore, where } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';
import { DogAndOwner } from '../../models/dog-and-owner.model';

//import {dog2} from '../services/dogcreator.service';

@Component({
  selector: 'app-dogdirectory',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterLink,NavigationComponent],
  templateUrl: './dogdirectory.component.html',
  styleUrl: './dogdirectory.component.css'
})
export class DogDirectoryComponent {
  // Get list of all the dogs

  allDogsInComponent: DogAndOwner[] = []; //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];
  nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length-1].dogid + 1 : 1;


  constructor(private dogcreator: DogCreatorService, private router: Router, public firestore: Firestore){;
  }

  ngOnInit(): void {
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
    this.router.navigate(['/details/new']);

  }
}
