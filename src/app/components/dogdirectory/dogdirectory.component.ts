import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../models/dog.model';
import { UploadListComponent } from '../upload-list/upload-list.component';
import { DogCreatorService } from '../../services/dogcreator.service';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { Firestore, addDoc, collection, getDoc, getDocs, query, doc, updateDoc, setDoc, CollectionReference, getDocFromServer, onSnapshot, PersistenceSettings, PersistentCacheSettings, initializeFirestore } from '@angular/fire/firestore';

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

  allDogsInComponent: Dog[] = []; //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];
  nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length-1].dogid + 1 : 1;


  constructor(private dogcreator: DogCreatorService, private router: Router, public firestore: Firestore){;
  }

  ngOnInit(): void {
    /*console.log("calling dogcreator");
    this.dogcreator.getDogs()
      .then(allDogs => this.allDogsInComponent = allDogs);*/

      const q = query(collection(this.firestore, "dogs"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            this.allDogsInComponent.push(change.doc.data() as Dog);
          }
          if (change.type === "removed") {
            console.log( "Removeing object with dogid ", change.doc.data()['dogid']);
            // get index of object with dogid equal to that of the removed doc
            const removeIndex = this.allDogsInComponent.findIndex( item => item.dogid === change.doc.data()['dogid'] );
            // remove object
            this.allDogsInComponent.splice( removeIndex, 1 );
          }
        });
        console.log("! Stored Dogs: ",this.allDogsInComponent);
      });

  }

  createNewDog() {
    console.log('Creating New Dog');
    //this.nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length - 1].dogid + 1 : 1; //update nextDogId in case additional dogs have been added
    //this.router.navigate(['/details', this.nextDogId]);
    this.router.navigate(['/details/new']);

  }
}
