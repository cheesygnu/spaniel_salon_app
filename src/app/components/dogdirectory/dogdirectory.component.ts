import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../models/dog.model';
import { DogCreatorService } from '../../services/dogcreator.service';
import { SelectedDog } from '../../services/selected-dog';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs, query, onSnapshot, where, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { DogAndOwner } from '../../models/dog-and-owner.model';
import { DogDetailsComponent } from '../dog-details/dog-details.component';
import { BLANK_DOG, ERROR_DOG } from '../../shared/mock-dogs';
import { MatIcon } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil, filter } from 'rxjs';
import { FIREBASE_FIRESTORE } from '../../app.config';

@Component({
    selector: 'app-dogdirectory',
    imports: [CommonModule, RouterLink, DogDetailsComponent, MatIcon],
    templateUrl: './dogdirectory.component.html',
    styleUrl: './dogdirectory.component.css'
})
export class DogDirectoryComponent implements OnInit, OnDestroy {

  //selectedDogId = signal<number>(ERROR_DOG.dogid);
  isHandsetOrTablet = signal<boolean>(false);

  allDogsInComponent: DogAndOwner[] = []; //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];
  //nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length-1].dog.dogid + 1 : 1;
  selectedDog!: Dog;
  //selectedDogAndOwner!: DogAndOwner;
  //editStatus: boolean = false;

  // Width of the dog list panel in pixels (desktop view only)
  dogListWidth = 450;
  public lastViewedDogId: number | null = null;
  private isResizing = false;
  private resizeStartX = 0;
  private resizeStartWidth = 450;
  //private userSelectedDogId: number | null = null; // Track user's manual selection
  //private lastRouteDogId: number | null = null; // Track last dog ID from route navigation
  private destroy$ = new Subject<void>();
  public firestore: Firestore;

  constructor(
    private dogcreator: DogCreatorService,
    private selectedDogService: SelectedDog,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ){
    this.firestore = inject(FIREBASE_FIRESTORE);
  }

  ngOnInit(): void {

    // Observe breakpoint changes for Handset and Tablet
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        const wasHandsetOrTablet = this.isHandsetOrTablet;
        this.isHandsetOrTablet.set(result.matches);
      });

    const dogquery = query(collection(this.firestore, "dogs"), orderBy("dogname"));
    const dogQueryUnsubscribe = onSnapshot(dogquery, (dogQuerySnapshot: QuerySnapshot<DocumentData>) => {
      this.allDogsInComponent = [];
      Promise.all(
        dogQuerySnapshot.docs.map(async (dogdoc) => {
            const dog = dogdoc.data() as Dog;
            const ownerName = await this.getDogOwnerName(dog.mappedOwner);
            const dogAndOwner: DogAndOwner = {
              dog: dog,
              ownerName: ownerName
            };
            return dogAndOwner;
        })
      ).then((dogsAndOwners) => {
      this.allDogsInComponent = dogsAndOwners;
      console.log("! Stored Dogs: ",this.allDogsInComponent);
      this.cdr.detectChanges();


    // Restore selectedDogId from localStorage if available
    const lastViewedDogIdStr =  localStorage.getItem('lastViewedDogId'); // Retrieve the stored value which is either a string or null
    const lastViewedDogId = lastViewedDogIdStr ? Number(lastViewedDogIdStr) : null; // Convert to number if it's a string, otherwise null
    if (lastViewedDogId) { // if there is a value stored in local storage
      const match = this.allDogsInComponent.find(item => item.dog.dogid === lastViewedDogId); // find the dog that matches the stored lastViewedDogId
      if (match) {
        this.selectedDogService.storeSelectedDog(match.dog);
      }
      else {
      this.selectedDogService.storeSelectedDog(this.allDogsInComponent[0].dog); // if no match set to the first dog in the list
      }
    }
    else {
      this.selectedDogService.storeSelectedDog(this.allDogsInComponent[0].dog); // if there is no value for lastViewedDogId set to the first dog in the list
    }
    console.log("SELECTED DOG ",this.selectedDogService.retrieveSelectedDog());
    });

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
    console.log('Setting selectedDogId to BLANK_DOG.dogid');
    //this.nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length - 1].dogid + 1 : 1; //update nextDogId in case additional dogs have been added
    //this.router.navigate(['/details', this.nextDogId]);

    this.selectedDogService.storeSelectedDog(BLANK_DOG); // Clear previous user selection when creating new dog

    //if in handset view open dog-details
    if (this.isHandsetOrTablet()) {
      this.router.navigate(['/details/new']);
      return;
    }
  }

  async selectDog(dog: Dog) {
    // Track user's manual selection
    this.selectedDogService.storeSelectedDog(dog);
  }


  onResizeMouseDown(event: MouseEvent) {
    if (this.isHandsetOrTablet()) {
      return;
    }
    this.isResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartWidth = this.dogListWidth;
    window.addEventListener('mousemove', this.onResizeMouseMove);
    window.addEventListener('mouseup', this.onResizeMouseUp);
    event.preventDefault();
  }

  private onResizeMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) {
      return;
    }
    const deltaX = event.clientX - this.resizeStartX;
    const minWidth = 300;
    const maxWidth = 800;
    const newWidth = Math.min(maxWidth, Math.max(minWidth, this.resizeStartWidth + deltaX));
    this.dogListWidth = newWidth;
    this.cdr.markForCheck(); // Mark after window event updates state
  };

  private onResizeMouseUp = () => {
    if (!this.isResizing) {
      return;
    }
    this.isResizing = false;
    window.removeEventListener('mousemove', this.onResizeMouseMove);
    window.removeEventListener('mouseup', this.onResizeMouseUp);
  };
}
