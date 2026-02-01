import { AfterViewInit, AfterContentInit, AfterViewChecked, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { Location } from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";
import { UNASSIGNED_ID, SCREEN_SIZE_BREAKPOINT, ERROR_ID } from "../../shared/constants";
import { BLANK_DOG } from "../../shared/mock-dogs";
import { EnterContactComponent } from "../enter-contact/enter-contact.component";
import { BLANK_OWNER } from "../../shared/mock-owners";


@Component({
    selector: "app-dog-detail",
    imports: [FormsModule, EnterContactComponent],
    templateUrl: "dog-details.component.html",
    styleUrls: ["dog-details.component.css"]
})
export class DogDetailsComponent implements OnInit, OnChanges {


  @Input() chosenDog!: Dog;  //chosenDog is the dog which was selected from DogDirectory. This will be undefined if a new dog.
  @Input() editStatus!: boolean;

  //public chosenDog!: Dog;
  public mappedOwner!: DogOwner
  //public editStatus: boolean = false;
  //public disabledStatus: boolean = !this.editStatus;
  public allOwnersInComponent: DogOwner[] = [];
  public displayedDog: Dog = structuredClone(BLANK_DOG); // displayed dog is used within this component because chosenDog should not be chnaged until 'Save' is pressed
  public displayedOwner: DogOwner = structuredClone(BLANK_OWNER);
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

  /*

  MediaOptions: string[] = ['all', 'print', 'sn', 'a','b','c','d','e','f','g','h','i'];

  _value = this.MediaOptions[1];

  set Value(val: any) {
    this._value = val;
  }
  get Value(): string {
    return this._value;
  }*/

  constructor(
    private route: ActivatedRoute,
    private dogCreatorservice: DogCreatorService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    /*this.checkFullScreen();
    window.addEventListener('resize', () => this.checkFullScreen());*/
    console.log("EditStatus >>> ", this.editStatus);
    // Check if we're navigating to dog-details via route (has route parameter) i.e. separate page from dog-directory
    const routeId = this.route.snapshot.paramMap.get('id');
    console.log("route id in dog-details: ", routeId);
    if (routeId) {
      if (routeId === "new") { // new dog
        this.editStatus = true; // immediately go into edit mode
        this.isFullScreen = true; // open as full screen
        console.log("route id associated with NEW dog: ", routeId);
      }
      else { //existing dog
        // When navigating via route, chosenDog is not set as @Input, so we need to fetch from route
        if (!this.chosenDog || this.chosenDog.dogid === ERROR_ID) {
          await this.getdogFromRoute();
        } else {
          this.getdog();
        }
        this.editStatus = false;
        this.isFullScreen = true; // Always full screen when navigating via route
        console.log("route id associated with EXISTING dog: ", routeId);
      }
      this.cdr.markForCheck(); // Mark after async operations in ngOnInit
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chosenDog'] && !changes['chosenDog'].firstChange && this.chosenDog) {
      this.getdog();
      // Only set editStatus to false if we're selecting an existing dog (not a blank/new dog)
      if (this.chosenDog.dogid !== UNASSIGNED_ID) {
        this.editStatus = false;
      }
      else this.editStatus = true;
      this.cdr.markForCheck(); // Mark after state changes in ngOnChanges
    }
  }




  private async getdogFromRoute(){
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const { storedDog: myDog, dogDocRef: myDogDocRef } = await this.dogCreatorservice.getDog(id);
      this.chosenDog = myDog;
      this.chosenDogDocRef = myDogDocRef;
      console.log("Chosen Dog from route: ", this.chosenDog );

      this.displayedDog = structuredClone(this.chosenDog);
      console.log("chosenDog.owner ", this.chosenDog.mappedOwner);

      const { storedOwner: myOwner, ownerDocRef: myOwnerDocRef } = await this.dogCreatorservice.getOwner(this.chosenDog.mappedOwner);
      this.mappedOwner = myOwner;
      this.mappedOwnerDocRef = myOwnerDocRef;
      this.displayedOwner = structuredClone(this.mappedOwner);
      await console.log("displayedOwner ", this.displayedOwner);
      this.cdr.markForCheck(); // Mark after async state updates
  }

  private async getdog(){
      if (!this.chosenDog) {
        return;
      }

      console.log("Chosen Dog: ", this.chosenDog );
      if (this.chosenDog.appointments && this.chosenDog.appointments.length > 0) {
        console.log("that has groom type ", this.chosenDog.appointments[0].groomType);
      }
      else{
        console.log("with no has groom type ");
      }
      //Enables edit after choosing to create a new dog
      if (this.chosenDog == BLANK_DOG) {
        console.log("DOG IS BLANK SO PUT IN EDIT MODE");
        this.editStatus = true;
        //this.disabledStatus = false;
      }

      this.displayedDog = structuredClone(this.chosenDog);
      console.log("chosenDog.owner ", this.chosenDog.mappedOwner);

      if (this.chosenDog.mappedOwner == UNASSIGNED_ID){
        this.displayedOwner = structuredClone(BLANK_OWNER);
      }
      else{
        const { storedOwner: myOwner, ownerDocRef: myOwnerDocRef } = await this.dogCreatorservice.getOwner(this.chosenDog.mappedOwner);
        this.mappedOwner = myOwner;
        this.mappedOwnerDocRef = myOwnerDocRef;
        this.displayedOwner = structuredClone(this.mappedOwner);
      }
      await console.log("displayedOwner ", this.displayedOwner);
      this.cdr.markForCheck(); // Mark after async state updates
  }

  private getAllOwners(): void {
      console.log("calling dogcreator");
      this.dogCreatorservice.getDogOwners()
        .then(allOwners => {
          this.allOwnersInComponent = allOwners;
          this.cdr.markForCheck(); // Mark after async state update
        });
  }

  backClicked() {
    console.log('Clicked Back');
    this.displayedDog = structuredClone(BLANK_DOG);
    console.log("BLANK_DOG looks like this ", BLANK_DOG);
    console.log("Blanking displayedDog", this.displayedDog);
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
    if(this.chosenDog === undefined){
      this.displayedDog = structuredClone(BLANK_DOG);
      this.mappedOwner = structuredClone(BLANK_OWNER);
    }
    else {
      this.displayedDog = structuredClone(this.chosenDog);
      this.displayedOwner = structuredClone(this.mappedOwner);
    }

    console.log('Displayed Dog is now: ', this.displayedDog);
    console.log('Chosen Dog is now: ', this.chosenDog);
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
      this.savePermitted = false;
    }
    if (this.displayedOwner.ownerFirstName =="") {
      console.log("Owner has a BLANK First Name");
      this.ownerFirstNameInputErrorStatus = "invalid";
      this.ownerFirstNameInputErrorText = "Owner's first name can't be blank";
      this.savePermitted = false;
    }
    if (this.displayedOwner.ownerSurname =="") {
      console.log("Owner has a BLANK Surame");
      this.ownerSurnameInputErrorStatus = "invalid";
      this.ownerSurnameInputErrorText = "Owner's surname can't be blank";
      this.savePermitted = false;
    }


    if (this.savePermitted == true) {
      this.dognameInputErrorStatus = "";
      this.dognameInputErrorText = "";
      this.editStatus= !this.editStatus;
      //this.disabledStatus = !this.disabledStatus;
      this.chosenDog = structuredClone(this.displayedDog);
      this.mappedOwner = structuredClone(this.displayedOwner);

      if(this.displayedOwner.ownerid==UNASSIGNED_ID){
        console.log ("Saving new owner", this.mappedOwner.ownerFirstName, " ", this.mappedOwner.ownerSurname);
        this.chosenDog.mappedOwner = await this.dogCreatorservice.createOwner(this.mappedOwner);
        console.log("Has mappedOwner been updated for chosen dog? ", this.chosenDog.mappedOwner);
      }
      else{
      this.modifyOwnerDetails();
      }

      if(this.displayedDog.dogid==UNASSIGNED_ID){
        console.log ("Saving new dog", this.chosenDog.dogname);
        this.dogCreatorservice.createDog(this.chosenDog);
      }
      else{
        this.modifyDogDetails();
      }
      this.cdr.markForCheck(); // Mark after async save operations
    }
  }

  modifyDogDetails(){
    console.log("ModifyDogDetails");
    this.dogCreatorservice.modifyDog(this.chosenDogDocRef, this.chosenDog);
  }

  modifyOwnerDetails(){
    console.log("ModifyOwnerDetails");
    this.dogCreatorservice.modifyOwner(this.mappedOwnerDocRef, this.mappedOwner);
  }

  changeOwner(){
    console.log("ChangeOwner");
  }

  /*checkFullScreen() {
    this.isSmallScreen = window.innerWidth < SCREEN_SIZE_BREAKPOINT;
  }*/
}

