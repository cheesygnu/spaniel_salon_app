import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../models/dog.model';
import { UploadListComponent } from '../upload-list/upload-list.component';
import { DogCreatorService } from '../../services/dogcreator.service';
import { RouterLink, RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { Firestore, addDoc, collection, getDoc, getDocs, query, doc, updateDoc, setDoc, CollectionReference, getDocFromServer, onSnapshot, PersistenceSettings, PersistentCacheSettings, initializeFirestore, where } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';
import { DogAndOwner } from '../../models/dog-and-owner.model';
import { DogDetailsComponent } from '../dog-details/dog-details.component';
import { BLANK_DOG, ERROR_DOG } from '../../shared/mock-dogs';
import { MatIcon } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil, filter } from 'rxjs';

//import {dog2} from '../services/dogcreator.service';

@Component({
    selector: 'app-dogdirectory',
    imports: [CommonModule, RouterLink, DogDetailsComponent, MatIcon],
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
  // Width of the dog list panel in pixels (desktop view only)
  dogListWidth = 450;
  private isResizing = false;
  private resizeStartX = 0;
  private resizeStartWidth = 450;
  private userSelectedDogId: number | null = null; // Track user's manual selection
  private lastRouteDogId: number | null = null; // Track last dog ID from route navigation
  private destroy$ = new Subject<void>();

  constructor(
    private dogcreator: DogCreatorService,
    private router: Router,
    private route: ActivatedRoute,
    public firestore: Firestore,
    private breakpointObserver: BreakpointObserver
  ){
  }

  ngOnInit(): void {
    // Restore lastRouteDogId from localStorage if available
    const storedDogId = localStorage.getItem('lastViewedDogId');
    if (storedDogId) {
      this.lastRouteDogId = Number(storedDogId);
    }

    // Track router navigation to capture dog ID from route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // Extract dog ID from /details/:id route
        const match = event.url.match(/\/details\/(\d+)/);
        if (match && match[1]) {
          const dogId = Number(match[1]);
          this.lastRouteDogId = dogId;
          localStorage.setItem('lastViewedDogId', dogId.toString());
        }
      });

    // Observe breakpoint changes for Handset and Tablet
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        const wasHandsetOrTablet = this.isHandsetOrTablet;
        this.isHandsetOrTablet = result.matches;

        // When switching from handset/tablet to desktop, restore last viewed dog from route
        if (wasHandsetOrTablet && !result.matches) {
          // Check multiple sources for dog ID
          const routerUrl = this.router.url;
          const windowPath = window.location.pathname;
          const storedDogId = localStorage.getItem('lastViewedDogId');

          // Try router URL first
          let match = routerUrl.match(/\/details\/(\d+)/);
          // If not found, try window location (in case router hasn't updated yet)
          if (!match) {
            match = windowPath.match(/\/details\/(\d+)/);
          }

          let dogIdToRestore: number | null = null;

          if (match && match[1]) {
            dogIdToRestore = Number(match[1]);
            // Navigate back to dog-directory if we're still on details route
            if (routerUrl.includes('/details/') || windowPath.includes('/details/')) {
              this.router.navigate(['/main/dog-directory']);
            }
          } else if (storedDogId) {
            dogIdToRestore = Number(storedDogId);
          } else if (this.lastRouteDogId !== null) {
            dogIdToRestore = this.lastRouteDogId;
          }

          if (dogIdToRestore !== null) {
            this.restoreDogFromRoute(dogIdToRestore);
          }
        }
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

      // Only set to first dog if user hasn't manually selected a dog, or if the selected dog no longer exists
      if (this.userSelectedDogId === null) {
        // No user selection, set to first dog
        this.selectedDog = (await this.dogcreator.getDog(this.allDogsInComponent[0].dogid)).storedDog;
      } else {
        // User has selected a dog - check if it still exists in the list
        const selectedDogStillExists = this.allDogsInComponent.some(dog => dog.dogid === this.userSelectedDogId);
        if (selectedDogStillExists) {
          // Preserve user's selection
          this.selectedDog = (await this.dogcreator.getDog(this.userSelectedDogId)).storedDog;
        } else {
          // Selected dog no longer exists, reset to first dog
          this.userSelectedDogId = null;
          this.selectedDog = (await this.dogcreator.getDog(this.allDogsInComponent[0].dogid)).storedDog;
        }
      }
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

    //if in handset view open dog-details
    this.router.navigate(['/details/new']);
  }

  async selectDog(dogAndOwner: DogAndOwner) {
    // Track user's manual selection
    this.userSelectedDogId = dogAndOwner.dogid;
    this.lastRouteDogId = dogAndOwner.dogid; // Also track for route restoration
    localStorage.setItem('lastViewedDogId', dogAndOwner.dogid.toString()); // Persist across component destruction
    const fetchedDog = await this.dogcreator.getDog(dogAndOwner.dogid);
    this.selectedDog = fetchedDog.storedDog;
    this.editStatus = false;
  }

  private async restoreDogFromRoute(dogId: number) {
    this.userSelectedDogId = dogId;
    const fetchedDog = await this.dogcreator.getDog(dogId);
    this.selectedDog = fetchedDog.storedDog;
    this.editStatus = false;
  }

  onResizeMouseDown(event: MouseEvent) {
    if (this.isHandsetOrTablet) {
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
