import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../models/dog.model';
import { DogCreatorService } from '../../services/dogcreator.service';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs, query, onSnapshot, where, orderBy } from 'firebase/firestore';
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

  selectedDogId = signal<number>(ERROR_DOG.dogid);
  isHandsetOrTablet = signal<boolean>(false);

  allDogsInComponent: DogAndOwner[] = []; //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];
  nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length-1].dogid + 1 : 1;
  selectedDogAndOwner!: DogAndOwner;
  //editStatus: boolean = false;

  // Width of the dog list panel in pixels (desktop view only)
  dogListWidth = 450;
  public lastViewedDogId: number | null = null;
  private isResizing = false;
  private resizeStartX = 0;
  private resizeStartWidth = 450;
  private userSelectedDogId: number | null = null; // Track user's manual selection
  //private lastRouteDogId: number | null = null; // Track last dog ID from route navigation
  private destroy$ = new Subject<void>();
  public firestore: Firestore;

  constructor(
    private dogcreator: DogCreatorService,
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
    const dogQueryUnsubscribe = onSnapshot(dogquery, async (dogQuerySnapshot) => {
      this.allDogsInComponent = [];
      dogQuerySnapshot.forEach(async (dogdoc) => {
          this.allDogsInComponent.push(dogdoc.data() as DogAndOwner);
          this.allDogsInComponent[this.allDogsInComponent.length-1].ownerName = await this.getDogOwnerName(dogdoc.data()['mappedOwner']);
        }
      );
      console.log("! Stored Dogs: ",this.allDogsInComponent);

    // Restore selectedDogId from localStorage if available
    const lastViewedDogIdStr =  localStorage.getItem('lastViewedDogId'); // Retrieve the stored value which is either a string or null
    this.lastViewedDogId = lastViewedDogIdStr ? Number(lastViewedDogIdStr) : null; // Convert to number if it's a string, otherwise null
    if (this.lastViewedDogId && this.allDogsInComponent.some(dog => dog.dogid === this.lastViewedDogId)) { // if there is a value stored in local storage & it still exists in the list
      this.selectedDogId.set(Number(localStorage.getItem('lastViewedDogId')));
    }
    else {
      this.selectedDogId.set(this.allDogsInComponent[0].dogid);
    }


     this.selectedDogAndOwner = this.allDogsInComponent.find(dog => dog.dogid === this.selectedDogId()) || this.allDogsInComponent[0];
      console.log("SELECTED DOG ",this.selectedDogAndOwner);
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

    this.selectedDogId.set(BLANK_DOG.dogid); // Clear previous user selection when creating new dog

    //if in handset view open dog-details
    if (this.isHandsetOrTablet()) {
      this.router.navigate(['/details/new']);
      return;
    }
  }

  async selectDog(dogAndOwner: DogAndOwner) {
    // Track user's manual selection
    this.selectedDogId.set(dogAndOwner.dogid);
    localStorage.setItem('lastViewedDogId', dogAndOwner.dogid.toString()); // Persist across component destruction
    console.log("SELECTED DOG ",dogAndOwner.dogname);
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
