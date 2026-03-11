import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dog } from '../../models/dog.model';
import { DogCreatorService } from '../../services/dogcreator.service';
import { SelectedDog } from '../../services/selected-dog.service';
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
    imports: [CommonModule, FormsModule, RouterLink, DogDetailsComponent, MatIcon],
    templateUrl: './dogdirectory.component.html',
    styleUrl: './dogdirectory.component.css'
})
export class DogDirectoryComponent implements OnInit, OnDestroy {

  //selectedDog = signal<Dog>(ERROR_DOG);  //this is chosen as a signal that gets passed to the dog-details component
  isHandsetOrTablet = signal<boolean>(false);

  allDogsInComponent = signal<DogAndOwner[]> ([]); //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];
  searchText = signal('');

  filteredDogsInComponent = computed ((): DogAndOwner[] => {
    console.log("filteredDogsInComponent called");
    const term = this.searchText().trim().toLowerCase();
    if (term === '') return this.allDogsInComponent();
    return this.allDogsInComponent().filter(
      (item) =>
        item.dog.dogname.toLowerCase().includes(term) ||
        item.ownerName.toLowerCase().includes(term)
    );
  });
  //nextDogId = this.allDogsInComponent.length > 0 ? this.allDogsInComponent[this.allDogsInComponent.length-1].dog.dogid + 1 : 1;
  //selectedDog!: Dog;
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
  private unsubscribeDogs: (() => void) | null = null;
  private unsubscribeOwners: (() => void) | null = null;
  public firestore: Firestore;
  public errorDogId = ERROR_DOG.dogid;

  constructor(
    private dogcreator: DogCreatorService,
    public selectedDogService: SelectedDog,
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
        this.isHandsetOrTablet.set(result.matches);
      });

    const dogquery = query(collection(this.firestore, "dogs"), orderBy("dogname"));
    this.unsubscribeDogs = onSnapshot(dogquery, (dogQuerySnapshot: QuerySnapshot<DocumentData>) => {
      this.allDogsInComponent.set([]);
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
      this.allDogsInComponent.set(dogsAndOwners);
      console.log("! Stored Dogs: ",this.allDogsInComponent());
      this.cdr.detectChanges();


      // Restore selectedDogId from localStorage if available
      const lastViewedDogIdStr =  localStorage.getItem('lastViewedDogId'); // Retrieve the stored value which is either a string or null
      const lastViewedDogId = lastViewedDogIdStr ? Number(lastViewedDogIdStr) : null; // Convert to number if it's a string, otherwise null
      const match = this.allDogsInComponent().find(item => item.dog.dogid === lastViewedDogId); // finds the dog that matches the stored lastViewedDogId
      if (lastViewedDogId === null || !match) { // if there is no value stored in local storage or lastViewedDogId is no longer in the list
        localStorage.setItem('lastViewedDogId', this.allDogsInComponent()[0].dog.dogid.toString()); // set to the first dog in the list
        this.selectedDogService.storeSelectedDog(this.allDogsInComponent()[0].dog);
      }
      else {
        localStorage.setItem('lastViewedDogId', match.dog.dogid.toString());
        this.selectedDogService.storeSelectedDog(match.dog);
      }
      console.log("SELECTED DOG ",this.selectedDogService.retrieveSelectedDog());

    })
  });
    // Subscribe to changes in the owners collection
    const ownerQuery = query(collection(this.firestore, 'dogOwners'));
    this.unsubscribeOwners = onSnapshot(ownerQuery, (ownerQuerySnapshot: QuerySnapshot<DocumentData>) => {
      if (this.allDogsInComponent().length === 0) return;
      const selectedDog = this.selectedDogService.retrieveSelectedDog();
      if (selectedDog.dogid === BLANK_DOG.dogid) return;
      const selectedMappedOwner = selectedDog.mappedOwner;
      // only update the owner name for the selected dog, because that is the only one that could have changed
      this.getDogOwnerName(selectedMappedOwner).then((ownerName) => {
        this.allDogsInComponent.set(this.allDogsInComponent().map((item: DogAndOwner) =>
          item.dog.mappedOwner === selectedMappedOwner ? { ...item, ownerName } : item
        ));
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeDogs?.();
    this.unsubscribeOwners?.();
    this.destroy$.next();
    this.destroy$.complete();
  }

  async getDogOwnerName(passedOwnerid: number): Promise<string> {
    let returnedOwnerName: string = "";
    console.log("ownerid is ", passedOwnerid);
    const querySnapshot = await getDocs(query(collection(this.firestore, 'dogOwners'), where("ownerid", "==", passedOwnerid)));
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
