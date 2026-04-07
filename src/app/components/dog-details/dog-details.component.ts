import { Component, ChangeDetectorRef, signal, computed, resource, OnDestroy, linkedSignal} from "@angular/core";
import { Router } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { DogImageService } from "../../services/dog-image.service";
import { SelectedDog } from "../../services/selected-dog.service";
import { Location } from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";
import { UNASSIGNED_ID } from "../../shared/constants";
import { BLANK_DOG, ERROR_DOG } from "../../shared/mock-dogs";
import { EnterContactComponent } from "../enter-contact/enter-contact.component";
import { BLANK_OWNER } from "../../shared/mock-owners";

interface DogDetailsInfoInterface{ // defines this structure to ensure type is checked when returning dogDetails
  dogDocRef: string;
  displayedOwner: DogOwner;
  originallySelectedOwner: DogOwner;
  ownerDocRef: string;
  displayedMainDogPhotoURL: string;
}


@Component({
    selector: "app-dog-details",
    imports: [FormsModule, EnterContactComponent],
    templateUrl: "dog-details.component.html",
    styleUrls: ["dog-details.component.css"]
})
export class DogDetailsComponent implements OnDestroy {
  public editStatus: boolean = false;
  public allOwnersInComponent: DogOwner[] = [];
  public dognameInputErrorStatus: string = "";
  public dognameInputErrorText: string = "";
  public savePermitted: boolean = true;
  public ownerFirstNameInputErrorStatus: string = "";
  public ownerSurnameInputErrorStatus: string = "";
  public ownerSurnameInputErrorText: string = "";
  public ownerFirstNameInputErrorText: string = "";
  isFullScreen: boolean = false;
  public errorDog: boolean = false;
  public saveWarning: boolean = false;
  public saveWarningMessage: string = "";
  public labels: {firstName: string, surname: string, dogName: string} = {firstName: "First Name", surname: "Surname", dogName: "Enter Dog's name"};
  public labelColourDogName = signal<string>("");
  public ownerIsExistingOwner: boolean = false;
  private orignallySelectedDog!: Dog;

  displayedMainDogPhotoURL = "../../..assets/default-dog-spaniel";

  public selectedDog = computed(() => this.selectedDogService.selectedDog());

  displayedDog = linkedSignal<Dog, Dog>({ //displayedDog is a linkedSignal
    source:() => this.selectedDog(),
    computation: (source, previous) => {
      if (this.editStatus === true){
        if(source != this.orignallySelectedDog) {
        console.log("Save or cancel edit before selecting a new dog");
          this.saveWarning = true;
          this.saveWarningMessage = "Save or cancel edit before selecting a new dog";
        }
        return previous?.value ?? structuredClone(ERROR_DOG);
      }
      else {
        this.orignallySelectedDog = source; // must set originallySelectedDog after editStatus is set to true

        if (source.dogid == BLANK_DOG.dogid) {
          this.editStatus = true;
          return structuredClone(BLANK_DOG);
        }
        else {
          return structuredClone(source);
        }
      }
    }
  })

  // loads the dogDocRef, dog's owners details (inc ownerDocRef) and hi-res photos. Because the compuation/loader is async can't use a linkedSignal
  dogDetails = resource<DogDetailsInfoInterface, number>({
  params: computed(() => this.displayedDog().dogid),
  loader: async ({params}) => {
    console.log("params: ", params);
    if (params== BLANK_DOG.dogid) {
      const dogPhotoURL = await this.updateDisplayedImage(BLANK_DOG);
      const dogDetailsInfo: DogDetailsInfoInterface = {
        dogDocRef: '',
        displayedOwner: structuredClone(BLANK_OWNER),
        originallySelectedOwner: structuredClone(BLANK_OWNER),
        ownerDocRef: '',
        displayedMainDogPhotoURL: dogPhotoURL,
      }
      return dogDetailsInfo;
    }
    else {
      const { storedDog: myStoredDog, dogDocRef: myDogDocRef } = await this.dogCreatorservice.getDog(params);
      const { storedOwner: myOwner, ownerDocRef: myOwnerDocRef } = await this.dogCreatorservice.getOwner(myStoredDog.mappedOwner);
      const dogPhotoURL = await this.updateDisplayedImage(myStoredDog);
      const dogDetailsInfo: DogDetailsInfoInterface = {
        dogDocRef: myDogDocRef,
        displayedOwner: structuredClone(myOwner),
        originallySelectedOwner: structuredClone(myOwner),
        ownerDocRef: myOwnerDocRef,
        displayedMainDogPhotoURL: dogPhotoURL,
      }
      return dogDetailsInfo;
    }
  },
});


  //displayedImageUrl = signal<string>("default-dog-spaniel.png");
  //pendingPhotos = new Map<number, File>();
  //private currentObjectUrl: string | null = null;


  constructor(
    private router: Router,
    private dogCreatorservice: DogCreatorService,
    private dogImageService: DogImageService,
    public selectedDogService: SelectedDog,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log("chosenDog in dog-details: ", this.selectedDogService.retrieveSelectedDog());
    if (this.router.url.substring(0, 8) == "/details"){
      this.isFullScreen = true;
    }
  }

backClicked() {
  console.log('Clicked Back');
  this.location.back();
}

editClicked(){
  console.log('Clicked Edit');
  console.log('Editing details for dogid', this.displayedDog().dogid);
  this.editStatus= true;
}

  cancelClicked(){
    console.log('Clicked Cancel');
    this.editStatus= false;
    this.displayedDog.set(this.orignallySelectedDog);
    if (this.dogDetails.hasValue()){
      this.dogDetails.value().displayedOwner = this.dogDetails.value().originallySelectedOwner;
      console.log("cancelClicked BLANK_DOG ID ", this.dogDetails.value().displayedOwner);
      // Don't need to reset ownerDocRef because when existing owner the owner document is not modified
    }
    else {
      console.log("cancelClicked but this.dogDetails has no value!!");
    }

    //this.pendingPhotos.clear();
    //this.revokeObjectUrl();
    //this.updateDisplayedImage(this.dogDetailsInfo.displayedDog);

    this.dognameInputErrorStatus = "";
    this.dognameInputErrorText = "";
    this.labels = {firstName: "First Name", surname: "Surname", dogName: "Enter Dog's name"}; //reset labels
    this.labelColourDogName.set("");
    this.ownerIsExistingOwner = false;
  }

  async saveClicked(){
    this.savePermitted = true;
    console.log('Clicked Save');
    console.log(this.displayedDog);
    if (!this.dogDetails.hasValue()){ console.log(" Save Clicked but this.dogDetails has no value!!"); }
    //Check for input errors
    if (this.displayedDog().dogname == "") {
      console.log("dogname is BLANK");
      this.dognameInputErrorStatus = "invalid";
      this.dognameInputErrorText = "Dog name can't be blank";
      this.labels = {...this.labels, dogName: "Dog name can't be blank"}; //must mutate the whole object to trigger the signal
      this.labelColourDogName.set("red");
      this.savePermitted = false;
    }
    if (this.dogDetails.value()?.displayedOwner.ownerFirstName =="") {
      console.log("Owner has a BLANK First Name");
      this.ownerFirstNameInputErrorStatus = "invalid";
      this.ownerFirstNameInputErrorText = "Owner's first name can't be blank";
      this.labels = {...this.labels, firstName: "First name can't be blank"}; //must mutate the whole object to trigger the signal
      this.labels.firstName = "First name can't be blank";
      this.savePermitted = false;
    }
    if (this.dogDetails.value()?.displayedOwner.ownerSurname =="") {
      console.log("Owner has a BLANK Surame");
      this.ownerSurnameInputErrorStatus = "invalid";
      this.ownerSurnameInputErrorText = "Owner's surname can't be blank";
      this.labels = {...this.labels, surname: "Surname can't be blank"};
      this.savePermitted = false;
    }


    if (this.savePermitted == true) {
      // reset all error messages prior to starting save
      this.dognameInputErrorStatus = "";
      this.dognameInputErrorText = "";
      this.labels = {firstName: "First Name", surname: "Surname", dogName: "Enter Dog's name"}; //reset labels
      this.labelColourDogName.set("");
      // need to reset editStatus before changing displayedDog, otherwise save warning will appear
      this.editStatus= !this.editStatus;


      console.log("displayedOwner.ownerid is ", this.dogDetails.value()?.displayedOwner.ownerid);
      console.log("selectedDog is: ", this.selectedDog);

      //await this.persistPendingPhotos();

      if(this.displayedDog().mappedOwner == UNASSIGNED_ID) { //checking against displayedDog because a new dog could haven been assigned an existing owner
        console.log ("Saving new owner", this.dogDetails.value()?.displayedOwner.ownerFirstName, " ", this.dogDetails.value()?.displayedOwner.ownerSurname);
        this.displayedDog().mappedOwner = await this.dogCreatorservice.createOwner(this.dogDetails.value()!.displayedOwner);
        console.log("New owner created with ownerid ", this.displayedDog().mappedOwner);
      }
      else if (this.ownerIsExistingOwner == true) { // don't want to modify the owner if it is an existing owner
        console.log("Owner is existing owner");
      }
      else{
      this.modifyOwnerDetails();

      }

      if(this.displayedDog().dogid==UNASSIGNED_ID){
        console.log ("Saving new dog", this.displayedDog().dogname);
        const newDogId = await this.dogCreatorservice.createDog(this.displayedDog());
        if (newDogId === ERROR_DOG.dogid) {
          console.error("createDog failed");
        }
        else {
          console.log("createDog succeeded. New dogid: ", newDogId);
          this.displayedDog().dogid = newDogId;

        }
      }
      else{
        console.log ("Called modifyDogDetails within saveClicked");
        this.modifyDogDetails();
      }

      // reset all remaing state information after a successful save
      this.ownerIsExistingOwner = false;
      //await this.updateDisplayedImage(this.dogDetailsInfo.displayedDog);
    }
  }

  modifyDogDetails(){
    console.log("ModifyDogDetails");
    console.log("displayedDog is ", this.displayedDog());
    console.log("selectedDog is ", this.selectedDog);
    console.log("dogDocRef is ", this.dogDetails.value()!.dogDocRef);
    if (!this.dogDetails.value()!.dogDocRef) {console.log("logical test of dogDocRef is false")};
    this.dogCreatorservice.modifyDog(this.dogDetails.value()!.dogDocRef, this.displayedDog());
  }

  modifyOwnerDetails(){
    console.log("ModifyOwnerDetails");
    this.dogCreatorservice.modifyOwner(this.dogDetails.value()!.ownerDocRef, this.dogDetails.value()!.displayedOwner);
  }

  closeSaveWarningModal() {
    this.selectedDogService.storeSelectedDog(this.orignallySelectedDog); // restore the originally selected dog
    this.saveWarning = false;
  }

  ngOnDestroy() {
    //this.revokeObjectUrl();
  }

  /* onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    input.value = '';
    const photos = this.dogDetailsInfo.displayedDog.dogPhotos ?? [];
    const nextOrdinal = photos.length > 0 ? Math.max(...photos.map(p => p.photoOrdinal)) + 1 : 1;
    if (!this.dogDetailsInfo.displayedDog.dogPhotos) this.dogDetailsInfo.displayedDog.dogPhotos = [];
    this.dogDetailsInfo.displayedDog.dogPhotos.push({ photoOrdinal: nextOrdinal, dogPhotoFilename: '' });
    this.pendingPhotos.set(nextOrdinal, file);
    this.revokeObjectUrl();
    this.currentObjectUrl = URL.createObjectURL(file);
    this.displayedImageUrl.set(this.currentObjectUrl);
    this.cdr.markForCheck();
  } */

  private async updateDisplayedImage(dog: Dog): Promise<string> {
    let imageUrl = 'default-dog-spaniel.png';
    /* const photos = dog.dogPhotos ?? [];
    if (photos.length === 0 || dog.dogid === BLANK_DOG.dogid) {
      this.revokeObjectUrl();
      this.displayedImageUrl.set(imageUrl);
      this.cdr.markForCheck();
      return imageUrl;
    }
    const firstPhoto = photos.sort((a, b) => a.photoOrdinal - b.photoOrdinal)[0];
    const pending = this.pendingPhotos.get(firstPhoto.photoOrdinal);
    if (pending) {
      this.revokeObjectUrl();
      this.currentObjectUrl = URL.createObjectURL(pending);
      imageUrl = this.currentObjectUrl;
      this.displayedImageUrl.set(imageUrl);
    } else if (firstPhoto.dogPhotoFilename) {
      const blob = await this.dogImageService.getImage(firstPhoto.dogPhotoFilename);
      this.revokeObjectUrl();
      if (blob) {
        this.currentObjectUrl = URL.createObjectURL(blob);
        imageUrl = this.currentObjectUrl;
        this.displayedImageUrl.set(imageUrl);
      } else {
        imageUrl = 'default-dog-spaniel.png';
        this.displayedImageUrl.set(imageUrl);
      }
    } else {
      imageUrl = 'default-dog-spaniel.png';
      this.displayedImageUrl.set(imageUrl);
    }
    this.cdr.markForCheck(); */
    return imageUrl;
  }

  /* private revokeObjectUrl(): void {
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  } */

  private sanitize(s: string): string {
    return s.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'unknown';
  }

  /* private async persistPendingPhotos(): Promise<void> {
    const photos = this.displayedDog.dogPhotos ?? [];
    const ownerSurname = this.displayedOwner.ownerSurname ?? '';
    const dogname = this.displayedDog.dogname ?? '';
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo.dogPhotoFilename) {
        const file = this.pendingPhotos.get(photo.photoOrdinal);
        if (file) {
          const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const sequence = i + 1;
          const filename = `${this.sanitize(dogname)}_${this.sanitize(ownerSurname)}_${sequence}.${ext}`;
          await this.dogImageService.saveImage(filename, file);
          photo.dogPhotoFilename = filename;
        }
      }
    }
    this.pendingPhotos.clear();
  } */

  // not used because should be in enter-details
  /*changeOwner(){
    console.log("ChangeOwner");
  }*/

  /*checkFullScreen() {
    this.isSmallScreen = window.innerWidth < SCREEN_SIZE_BREAKPOINT;
  }*/
}

