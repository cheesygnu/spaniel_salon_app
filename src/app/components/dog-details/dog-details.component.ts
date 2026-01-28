import { AfterViewInit, AfterContentInit, AfterViewChecked, Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { Location } from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";
import { UNASSIGNED_ID, SCREEN_SIZE_BREAKPOINT, ERROR_ID } from "../../shared/constants";
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
  ) {}

  async ngOnInit() {
    /*this.checkFullScreen();
    window.addEventListener('resize', () => this.checkFullScreen());*/
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:64',message:'ngOnInit called',data:{chosenDogId:this.chosenDog?.dogid,chosenDogName:this.chosenDog?.dogname,editStatus:this.editStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.log("EditStatus >>> ", this.editStatus);
    // Check if we're navigating to dog-details via route (has route parameter) i.e. separate page from dog-directory
    const routeId = this.route.snapshot.paramMap.get('id');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:70',message:'Route check',data:{routeId:routeId,hasRouteId:!!routeId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.log("route id in dog-details: ", routeId);
    if (routeId) {
      if (routeId === "new") { // new dog
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:78',message:'Route is new dog',data:{routeId:routeId},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        this.editStatus = true; // immediately go into edit mode
        this.isFullScreen = true; // open as full screen
        console.log("route id associated with NEW dog: ", routeId);
      }
      else { //existing dog
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:84',message:'Route is existing dog - calling getdog',data:{routeId:routeId,chosenDogExists:!!this.chosenDog,chosenDogId:this.chosenDog?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        // When navigating via route, chosenDog is not set as @Input, so we need to fetch from route
        if (!this.chosenDog || this.chosenDog.dogid === ERROR_ID) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:88',message:'chosenDog not set - calling getdogFromRoute',data:{routeId:routeId},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          await this.getdogFromRoute();
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:92',message:'chosenDog exists - calling getdog',data:{chosenDogId:this.chosenDog?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          this.getdog();
        }
        this.editStatus = false;
        this.isFullScreen = true; // Always full screen when navigating via route
        console.log("route id associated with EXISTING dog: ", routeId);
      }

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:91',message:'ngOnChanges called',data:{hasChosenDogChange:!!changes['chosenDog'],isFirstChange:changes['chosenDog']?.firstChange,chosenDogId:this.chosenDog?.dogid,chosenDogName:this.chosenDog?.dogname,previousValue:changes['chosenDog']?.previousValue?.dogid,currentValue:changes['chosenDog']?.currentValue?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (changes['chosenDog'] && !changes['chosenDog'].firstChange && this.chosenDog) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:94',message:'Calling getdog from ngOnChanges',data:{chosenDogId:this.chosenDog?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      this.getdog();
      // Only set editStatus to false if we're selecting an existing dog (not a blank/new dog)
      if (this.chosenDog.dogid !== UNASSIGNED_ID) {
        this.editStatus = false;
      }
      else this.editStatus = true;
    }
  }




  private async getdogFromRoute(){
      const id = Number(this.route.snapshot.paramMap.get('id'));
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:117',message:'getdogFromRoute called',data:{routeId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      const { storedDog: myDog, dogDocRef: myDogDocRef } = await this.dogCreatorservice.getDog(id);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:120',message:'Dog fetched from route',data:{fetchedDogId:myDog?.dogid,fetchedDogName:myDog?.dogname},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      this.chosenDog = myDog;
      this.chosenDogDocRef = myDogDocRef;
      console.log("Chosen Dog from route: ", this.chosenDog );

      this.displayedDog = structuredClone(this.chosenDog);
      console.log("chosenDog.owner ", this.chosenDog.mappedOwner);

      const { storedOwner: myOwner, ownerDocRef: myOwnerDocRef } = await this.dogCreatorservice.getOwner(this.chosenDog.mappedOwner);
      this.mappedOwner = myOwner;
      this.mappedOwnerDocRef = myOwnerDocRef;
      this.displayedOwner = structuredClone(this.mappedOwner);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:130',message:'getdogFromRoute completed',data:{chosenDogId:this.chosenDog?.dogid,displayedDogId:this.displayedDog?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      await console.log("displayedOwner ", this.displayedOwner);

  }

  private async getdog(){
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:123',message:'getdog called',data:{chosenDogExists:!!this.chosenDog,chosenDogId:this.chosenDog?.dogid,chosenDogName:this.chosenDog?.dogname,isBlankDog:this.chosenDog==BLANK_DOG,isErrorDog:this.chosenDog?.dogid==ERROR_ID},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      if (!this.chosenDog) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:125',message:'getdog early return - chosenDog is falsy',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:134',message:'chosenDog matches BLANK_DOG',data:{chosenDogId:this.chosenDog?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        console.log("DOG IS BLANK SO PUT IN EDIT MODE");
        this.editStatus = true;
        //this.disabledStatus = false;
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:140',message:'Setting displayedDog from chosenDog',data:{chosenDogId:this.chosenDog?.dogid,chosenDogName:this.chosenDog?.dogname,displayedDogBefore:this.displayedDog?.dogid},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      this.displayedDog = structuredClone(this.chosenDog);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3b26f1b5-9bdf-4d2a-9a85-a2a7e6db7188',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dog-details.component.ts:143',message:'displayedDog set',data:{displayedDogId:this.displayedDog?.dogid,displayedDogName:this.displayedDog?.dogname},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
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
    //this.disabledStatus = !this.disabledStatus;
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

  maxWindowClicked() {
    throw new Error('Method not implemented.');
    }
}

