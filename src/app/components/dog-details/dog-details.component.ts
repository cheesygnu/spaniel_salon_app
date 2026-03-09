import { AfterViewInit, AfterContentInit, Component, effect, input, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, signal} from "@angular/core";
import { explicitEffect } from "ngxtension/explicit-effect"
import { ActivatedRoute, Router } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { SelectedDog } from "../../services/selected-dog";
import { Location } from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";
import { UNASSIGNED_ID, SCREEN_SIZE_BREAKPOINT, ERROR_ID } from "../../shared/constants";
import { BLANK_DOG, ERROR_DOG } from "../../shared/mock-dogs";
import { EnterContactComponent } from "../enter-contact/enter-contact.component";
import { BLANK_OWNER } from "../../shared/mock-owners";


@Component({
    selector: "app-dog-details",
    imports: [FormsModule, EnterContactComponent],
    templateUrl: "dog-details.component.html",
    styleUrls: ["dog-details.component.css"]
})
export class DogDetailsComponent implements OnInit {

  // There is no local variable selectedDog, selectedDog will be called from the selected-dog service

  // chosenDog is the dog which was selected from DogDirectory. It is not computed from selectedDog,
  // instead it will be updated in a controlled way.
  // It will be used to update the dog in the database if the user saves the edit.
  // It will be used to revert the dog back to its original state if the user cancels the edit.

// displayed dog is used within this component because chosenDog should not be changed until 'Save' is pressed


  //public chosenDog!: Dog;
  public mappedOwner!: DogOwner
  //public editStatus: boolean = false;
  //public disabledStatus: boolean = !this.editStatus;
  public editStatus = false;
  public allOwnersInComponent: DogOwner[] = [];
  public displayedDog: Dog = structuredClone(BLANK_DOG);
  public displayedOwner: DogOwner = structuredClone(BLANK_OWNER);
  private chosenDog!: Dog;
  public chosenDogDocRef!: string;
  public mappedOwnerDocRef!: string;
  public dognameInputErrorStatus: string = "";
  public dognameInputErrorText: string = "";
  public savePermitted: boolean = true;
  public ownerFirstNameInputErrorStatus: string = "";
  public ownerSurnameInputErrorStatus: string = "";
  public ownerSurnameInputErrorText: string = "";
  public ownerFirstNameInputErrorText: string = "";
  isFullScreen: boolean = false;
  public errorDog: boolean = true;
  public saveWarning: boolean = false;
  public saveWarningMessage: string = "";
  public labels: {firstName: string, surname: string, dogName: string} = {firstName: "First Name", surname: "Surname", dogName: "Enter Dog's name"};
  public labelColourDogName = signal<string>("");
  public ownerIsExistingOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dogCreatorservice: DogCreatorService,
    public selectedDogService: SelectedDog,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
    //This effect is called whenever the selectedDogId changes
    explicitEffect([this.selectedDogService.selectedDogId], ([selectedDogIdValue]) => {
      console.log("EFFECT: selectedDogIdValue: ", selectedDogIdValue);
      // after choosing to create a new dog enable edit,
      // and don't call getdog() because BLANK_DOG is no stored and it will return ERROR_DOG
      if (this.editStatus == true && this.router.url.substring(0, 8) != "/details") {
        console.log("Save or cancel edit before selecting a new dog");
        this.selectedDogService.storeSelectedDog(this.chosenDog); // restore the selected dog
        this.saveWarning = true;
        this.saveWarningMessage = "Save or cancel edit before selecting a new dog";
        this.cdr.detectChanges();
      }
      else if (selectedDogIdValue == BLANK_DOG.dogid) {
        //I may put this code into a separate function as it is repeated in ngOnInit
        this.displayedDog = structuredClone(BLANK_DOG);
        this.displayedOwner = structuredClone(BLANK_OWNER);
        this.chosenDogDocRef = ""; // resetting because it could persist from a previous dog
        this. mappedOwnerDocRef = ""; // resetting because it could persist from a previous dog
        console.log("DOG IS BLANK SO PUT IN EDIT MODE");
        this.editStatus = true;
        // end of repeated code
        this.errorDog = false;
        this.cdr.detectChanges();
      }
      else {
      //updates the displayed dog by calling getdog()
        this.getdog().then(() => {
          this.errorDog = false; // selectedDog should only equal ERROR_DOG before a dog is selected
          this.cdr.detectChanges(); // don't know why this can't be at the end of the effect, but it doesn't work if it is
        });
      }
    });

  }

  ngOnInit() {
    console.log("chosenDog in dog-details: ", this.selectedDogService.retrieveSelectedDog());
    if (this.router.url.substring(0, 8) == "/details"){
      this.isFullScreen = true;
    }
    if (this.selectedDogService.retrieveSelectedDog().dogid == BLANK_DOG.dogid) {
      this.displayedDog = structuredClone(BLANK_DOG);
      this.displayedOwner = structuredClone(BLANK_OWNER);
      this.chosenDogDocRef = ""; // resetting because it could persist from a previous dog
      this. mappedOwnerDocRef = ""; // resetting because it could persist from a previous dog
      console.log("DOG IS BLANK SO PUT IN EDIT MODE");
      this.editStatus = true;
    }
    else {
    this.getdog().then(() => {
      this.errorDog = false; // selectedDog should only equal ERROR_DOG before a dog is selected
    });
    }
  }


  private async getdog(){
    // this function calls the dogCreatorService to get the stored dog because
    // the details in the dog object from selectedDogService may be stale,
    // e.g. the dog's details have been updated the phone app but dogdirectory on the laptop hasn't been refreshed)
    const id = this.selectedDogService.retrieveSelectedDog().dogid;
    const { storedDog: myDog, dogDocRef: myDogDocRef } = await this.dogCreatorservice.getDog(id);
    this.chosenDog = myDog;
    this.chosenDogDocRef = myDogDocRef;
    console.log("Chosen Dog is: ", this.chosenDog );
    this.displayedDog = structuredClone(this.chosenDog);

    const { storedOwner: myOwner, ownerDocRef: myOwnerDocRef } = await this.dogCreatorservice.getOwner(this.chosenDog.mappedOwner);
    this.mappedOwner = myOwner;
    this.mappedOwnerDocRef = myOwnerDocRef;
    this.displayedOwner = structuredClone(this.mappedOwner);
  }

  // not used because should be in enter-details
  /*private getAllOwners(): void {
      console.log("calling dogcreator");
      this.dogCreatorservice.getDogOwners()
        .then(allOwners => {
          this.allOwnersInComponent = allOwners;
          this.cdr.markForCheck(); // Mark after async state update
        });
  }*/

  backClicked() {
    console.log('Clicked Back');
    //this.displayedDog = structuredClone(BLANK_DOG);
    //console.log("BLANK_DOG looks like this ", BLANK_DOG);
    //console.log("Blanking displayedDog", this.displayedDog);
    this.location.back();
  }

  editClicked(){
    console.log('Clicked Edit');
    console.log('Editing details for dogid', this.displayedDog.dogid);
    this.editStatus= !this.editStatus;
    //this.disabledStatus = !this.disabledStatus;
    this.cdr.markForCheck(); // Mark after state change
  }

  cancelClicked(){
    console.log('Clicked Cancel');
    this.editStatus= !this.editStatus;
    //this.disabledStatus = !this.disabledStatus;
    if(this.displayedDog.dogid === BLANK_DOG.dogid){
      this.displayedDog = structuredClone(BLANK_DOG);
      this.mappedOwner = structuredClone(BLANK_OWNER);
    }
    else {
      this.displayedDog = structuredClone(this.chosenDog);
      this.displayedOwner = structuredClone(this.mappedOwner);
    }

    console.log('Displayed Dog is now: ', this.displayedDog);
    console.log('Chosen Dog is now: ', this.chosenDog);
    this.dognameInputErrorStatus = "";
    this.dognameInputErrorText = "";
    this.labels = {firstName: "First Name", surname: "Surname", dogName: "Enter Dog's name"}; //reset labels
    this.labelColourDogName.set("");
    this.ownerIsExistingOwner = false;
    this.cdr.markForCheck(); // Mark after state changes
  }

  async saveClicked(){
    this.savePermitted = true;
    console.log('Clicked Save');
    console.log(this.displayedDog);
    //Check for input errors
    if (this.displayedDog.dogname == "") {
      console.log("dogname is BLANK");
      this.dognameInputErrorStatus = "invalid";
      this.dognameInputErrorText = "Dog name can't be blank";
      this.labels = {...this.labels, dogName: "Dog name can't be blank"}; //must mutate the whole object to trigger the signal
      this.labelColourDogName.set("red");
      this.savePermitted = false;
    }
    if (this.displayedOwner.ownerFirstName =="") {
      console.log("Owner has a BLANK First Name");
      this.ownerFirstNameInputErrorStatus = "invalid";
      this.ownerFirstNameInputErrorText = "Owner's first name can't be blank";
      this.labels = {...this.labels, firstName: "First name can't be blank"}; //must mutate the whole object to trigger the signal
      this.labels.firstName = "First name can't be blank";
      this.savePermitted = false;
    }
    if (this.displayedOwner.ownerSurname =="") {
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


      console.log("displayedOwner.ownerid is ", this.displayedOwner.ownerid);
      console.log("chosenDog is: ", this.chosenDog);

      //this.chosenDog = structuredClone(this.displayedDog);
      this.mappedOwner = structuredClone(this.displayedOwner); //this.mappedOwner is the mapped Owner of displayedDog, NOT chosenDog. Also mappedOwner here is an object of type Owner, in Firestore and this.displayedDog.mappedOwner, mappedOwner is the ownerid of the owner

      if(this.displayedDog.mappedOwner == UNASSIGNED_ID) { //checking against displayedDog because a new dog could haven been assigned an existing owner
        console.log ("Saving new owner", this.mappedOwner.ownerFirstName, " ", this.mappedOwner.ownerSurname);
        this.displayedDog.mappedOwner = await this.dogCreatorservice.createOwner(this.mappedOwner);
        console.log("New owner created with ownerid ", this.displayedDog.mappedOwner);
      }
      else if (this.ownerIsExistingOwner == true) { // don't want to modify the owner if it is an existing owner
        console.log("Owner is existing owner");
      }
      else{
      this.modifyOwnerDetails();

      }

      if(this.displayedDog.dogid==UNASSIGNED_ID){
        console.log ("Saving new dog", this.displayedDog.dogname);
        const newDogId = await this.dogCreatorservice.createDog(this.displayedDog);
        if (newDogId === ERROR_DOG.dogid) {
          console.error("createDog failed");
        }
        else {
          console.log("createDog succeeded. New dogid: ", newDogId);
          this.displayedDog.dogid = newDogId;

        }
      }
      else{
        console.log ("Called modifyDogDetails within saveClicked");
        this.modifyDogDetails();
      }

      // set all state information after a successful save
      this.ownerIsExistingOwner = false;
      this.editStatus= !this.editStatus;
      this.chosenDog = structuredClone(this.displayedDog);
      this.selectedDogService.storeSelectedDog(this.chosenDog);

      this.cdr.markForCheck(); // Mark after async save operations
    }
  }

  modifyDogDetails(){
    console.log("ModifyDogDetails");
    console.log("displayedDog is ", this.displayedDog);
    console.log("chosenDog is ", this.chosenDog);
    console.log("chosenDogDocRef is ", this.chosenDogDocRef);
    this.dogCreatorservice.modifyDog(this.chosenDogDocRef, this.displayedDog);
  }

  modifyOwnerDetails(){
    console.log("ModifyOwnerDetails");
    this.dogCreatorservice.modifyOwner(this.mappedOwnerDocRef, this.mappedOwner);
  }

  closeSaveWarningModal() {
    this.saveWarning = false;
  }

  // not used because should be in enter-details
  /*changeOwner(){
    console.log("ChangeOwner");
  }*/

  /*checkFullScreen() {
    this.isSmallScreen = window.innerWidth < SCREEN_SIZE_BREAKPOINT;
  }*/
}

