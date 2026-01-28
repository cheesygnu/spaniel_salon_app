import { Component, OnInit, OnDestroy } from '@angular/core';

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
import { MatIcon } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

//import {dog2} from '../services/dogcreator.service';

@Component({
    selector: 'app-dogdirectory',
    imports: [RouterLink, DogDetailsComponent, MatIcon],
    templateUrl: './dogdirectory.component.html',
    styleUrl: './dogdirectory.component.css'
})
export class DogDirectoryComponent implements OnInit, OnDestroy {
  // Get list of all the dogs

  allDogsInComponent: DogAndOwner[] = []; //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];
  nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length-1].dogid + 1 : 1;
  selectedDog: Dog = ERROR_DOG;
  editStatus: boolean = false;
  isHandsetOrTablet: boolean = false;
  private userSelectedDogId: number | null = null; // Track user's manual selection
  private destroy$ = new Subject<void>();

  constructor(
    private dogcreator: DogCreatorService,
    private router: Router,
    public firestore: Firestore,
    private breakpointObserver: BreakpointObserver
  ){
  }

  ngOnInit(): void {
    // Observe breakpoint changes for Handset and Tablet
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isHandsetOrTablet = result.matches;
      });

    const dogquery = query(collection(this.firestore, "dogs"), orderBy("dogname"));
    const dogQueryUnsubscribe = onSnapshot(dogquery, async (dogQuerySnapshot) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:53',message:'onSnapshot callback triggered',data:{currentSelectedDogId:this.selectedDog?.dogid,currentSelectedDogName:this.selectedDog?.dogname,snapshotSize:dogQuerySnapshot.size},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      this.allDogsInComponent = [];
      dogQuerySnapshot.forEach(async (dogdoc) => {
          this.allDogsInComponent.push(dogdoc.data() as DogAndOwner);
          this.allDogsInComponent[this.allDogsInComponent.length-1].ownerName = await this.getDogOwnerName(dogdoc.data()['mappedOwner']);
        }
      );
      console.log("! Stored Dogs: ",this.allDogsInComponent);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:61',message:'onSnapshot callback - checking user selection',data:{userSelectedDogId:this.userSelectedDogId,currentSelectedDogId:this.selectedDog?.dogid,firstDogId:this.allDogsInComponent[0]?.dogid,allDogsCount:this.allDogsInComponent.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Only set to first dog if user hasn't manually selected a dog, or if the selected dog no longer exists
      if (this.userSelectedDogId === null) {
        // No user selection, set to first dog
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:66',message:'No user selection - setting to first dog',data:{firstDogId:this.allDogsInComponent[0]?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        this.selectedDog = (await this.dogcreator.getDog(this.allDogsInComponent[0].dogid)).storedDog;
      } else {
        // User has selected a dog - check if it still exists in the list
        const selectedDogStillExists = this.allDogsInComponent.some(dog => dog.dogid === this.userSelectedDogId);
        if (selectedDogStillExists) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:72',message:'Preserving user selection',data:{userSelectedDogId:this.userSelectedDogId},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          // Preserve user's selection
          this.selectedDog = (await this.dogcreator.getDog(this.userSelectedDogId)).storedDog;
        } else {
          // Selected dog no longer exists, reset to first dog
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:77',message:'User selected dog no longer exists - resetting to first',data:{userSelectedDogId:this.userSelectedDogId,firstDogId:this.allDogsInComponent[0]?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          this.userSelectedDogId = null;
          this.selectedDog = (await this.dogcreator.getDog(this.allDogsInComponent[0].dogid)).storedDog;
        }
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:84',message:'selectedDog set by onSnapshot',data:{selectedDogId:this.selectedDog?.dogid,selectedDogName:this.selectedDog?.dogname},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log("SELECTED DOG ",this.selectedDog);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.userSelectedDogId = null; // Clear user selection when creating new dog
    this.selectedDog = structuredClone(BLANK_DOG);
    this.editStatus = true;
  }

  async selectDog(dogAndOwner: DogAndOwner) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:90',message:'selectDog called',data:{dogid:dogAndOwner.dogid,dogname:dogAndOwner.dogname,currentSelectedDog:this.selectedDog?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    // Track user's manual selection
    this.userSelectedDogId = dogAndOwner.dogid;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:94',message:'userSelectedDogId set',data:{userSelectedDogId:this.userSelectedDogId},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const fetchedDog = await this.dogcreator.getDog(dogAndOwner.dogid);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:97',message:'Dog fetched from service',data:{fetchedDogId:fetchedDog.storedDog?.dogid,fetchedDogName:fetchedDog.storedDog?.dogname},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    this.selectedDog = fetchedDog.storedDog;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dogdirectory.component.ts:100',message:'selectedDog set',data:{selectedDogId:this.selectedDog?.dogid,selectedDogName:this.selectedDog?.dogname},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    this.editStatus = false;
  }
}
