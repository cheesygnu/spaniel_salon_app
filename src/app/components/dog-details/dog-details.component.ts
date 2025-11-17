import { AfterViewInit, AfterContentInit, AfterViewChecked, Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { Location } from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";
import { UNASSIGNED_ID, SCREEN_SIZE_BREAKPOINT } from "../../shared/constants";
import { BLANK_DOG } from "../../shared/mock-dogs";
import { EnterContactComponent } from "../enter-contact/enter-contact.component";
import { BLANK_OWNER } from "../../shared/mock-owners";
import { Firestore, addDoc, collection, getDoc, getDocs, query, doc, updateDoc, setDoc, CollectionReference, getDocFromServer, onSnapshot, PersistenceSettings, PersistentCacheSettings, initializeFirestore, where } from '@angular/fire/firestore';


@Component({
    selector: "app-dog-detail",
    imports: [FormsModule, EnterContactComponent, RouterLink],
    templateUrl: "dog-details.component.html",
    styleUrls: ["dog-details.component.css"]
})
export class DogDetailsComponent implements OnInit, OnChanges {


  @Input() chosenDog!: Dog;  //chosenDog is the dog which was selected from DogDirectory. This will be undefined if a new dog.

  //public chosenDog!: Dog;
  public mappedOwner!: DogOwner
  public editStatus: boolean = false;
  public disabledStatus: boolean = !this.editStatus;
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
  isSmallScreen: boolean = false;

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
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    // Check if we're navigating via route (has route parameter)
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      if (routeId === "new") {
        this.editStatus = true; // immediately go into edit mode
      } else {
        this.getdogFromRoute();
      }
    } else if (this.chosenDog) {
      // Used as child component with input
      this.getdog();
    }

    //this.getAllOwners();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chosenDog'] && !changes['chosenDog'].firstChange && this.chosenDog) {
      this.getdog();
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

  }

  private async getdog(){
      if (!this.chosenDog) return;

      console.log("Chosen Dog: ", this.chosenDog );

      this.displayedDog = structuredClone(this.chosenDog);
      console.log("chosenDog.owner ", this.chosenDog.mappedOwner);

      const { storedOwner: myOwner, ownerDocRef: myOwnerDocRef } = await this.dogCreatorservice.getOwner(this.chosenDog.mappedOwner);
      this.mappedOwner = myOwner;
      this.mappedOwnerDocRef = myOwnerDocRef;
      this.displayedOwner = structuredClone(this.mappedOwner);
      await console.log("displayedOwner ", this.displayedOwner);

  }

  private getAllOwners(): void {
      console.log("calling dogcreator");
      this.dogCreatorservice.getDogOwners()
        .then(allOwners => this.allOwnersInComponent = allOwners);
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
    this.disabledStatus = !this.disabledStatus;
  }

  cancelClicked(){
    console.log('Clicked Cancel');
    this.editStatus= !this.editStatus;
    this.disabledStatus = !this.disabledStatus;
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
      this.disabledStatus = !this.disabledStatus;
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

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < SCREEN_SIZE_BREAKPOINT;
  }

  maxWindowClicked() {
    throw new Error('Method not implemented.');
    }
}

