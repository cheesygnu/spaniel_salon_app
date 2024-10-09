import { AfterViewInit, AfterContentInit, AfterViewChecked, Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { CommonModule, Location} from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";
import { UNASSIGNED } from "../../shared/constants";


@Component({
  selector: "app-dog-detail",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./dog-details.component.html",
  styleUrls: ["./dog-details.component.css"]
})
export class DogDetailsComponent implements OnInit {
  //chosenDog is the dog which was selected from DogDirectory
  @Input() chosenDog!: Dog;

  public editStatus: boolean = false;
  public disabledStatus: boolean = !this.editStatus;
  public allOwnersInComponent: DogOwner[] = [];
  public assignedOwner!: DogOwner;

  displayedDogName: string = UNASSIGNED; //'displayed' refers to what is currently displayed, it does not change the dog details until saved

  //Dog owner names kept for the moment but will remove because editing an owner may move to a new component
  displayedOwnerFirstName: string = UNASSIGNED;
  displayedOwnerSurname: string = UNASSIGNED;
  selectedOwnerSurname: string = UNASSIGNED;

  //Dog owner contact kept for the moment but will remove modify for multiple contact records
  displayedOwnerContact: string = UNASSIGNED;

  showDogId: any = UNASSIGNED;


  MediaOptions: string[] = ['all', 'print', 'sn', 'a','b','c','d','e','f','g','h','i'];

  _value = this.MediaOptions[1];

  set Value(val: any) {
    this._value = val;
  }
  get Value(): string {
    return this._value;
  }

  constructor(
    private route: ActivatedRoute,
    private dogCreatorservice: DogCreatorService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.Value=this.MediaOptions[2];
    this.getdogs();
    this.getAllOwners();

  }



  private getdogs(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
		this.dogCreatorservice.getDog(id).then(dog => (this.chosenDog = dog));
    this.dogCreatorservice.getDog(id).then(dog => (this.displayedOwnerFirstName = dog.owner.ownerFirstName));
    this.dogCreatorservice.getDog(id).then(dog => (this.displayedOwnerSurname = dog.owner.ownerSurname));
    this.dogCreatorservice.getDog(id).then(dog => (this.selectedOwnerSurname = dog.owner.ownerSurname));
    //this.displayedDogName = this.chosenDog.dogname;
    this.dogCreatorservice.getDog(id).then(dog => (this.displayedDogName = dog.dogname));
    this.dogCreatorservice.getDog(id).then(dog => (this.displayedOwnerContact = dog.owner.ownerContactDetails));
    this.dogCreatorservice.getDog(id).then(dog => (this.showDogId = dog.dogid));
    this.getShownDogId();
    //console.log('getdogs showDogId:', this.showDogId);
    //this.showDogId = 456;
    //this.showDogId = dog.dogid;
    //this.showDogId = this.chosenDog.dogid ? this.chosenDog.dogid : 999;
    //   heroService.getHero(id).subscribe(hero => (this.hero = hero));
  }

  private getAllOwners(): void {
      console.log("calling dogcreator");
      this.dogCreatorservice.getDogOwners()
        .then(allOwners => this.allOwnersInComponent = allOwners);
  }

  backClicked() {
    console.log('Clicked Back');
    this.location.back();
  }

  editClicked(){
    console.log('Clicked Edit');
    console.log('Editing details for dogid', this.showDogId);
    this.editStatus= !this.editStatus;
    this.disabledStatus = !this.disabledStatus;
    this.displayedDogName = this.chosenDog.dogname;
    this.displayedOwnerContact = this.chosenDog.owner.ownerContactDetails;

  }

  cancelClicked(){
    console.log('Clicked Cancel');
    this.editStatus= !this.editStatus;
    this.disabledStatus = !this.disabledStatus;
    this.displayedDogName = this.chosenDog.dogname;
    this.displayedOwnerContact = this.chosenDog.owner.ownerContactDetails;
  }

  saveClicked(){
    console.log('Clicked Save');
    this.editStatus= !this.editStatus;
    this.disabledStatus = !this.disabledStatus;
    this.chosenDog.dogname = this.displayedDogName;
    this.chosenDog.owner.ownerContactDetails = this.displayedOwnerContact;

  }

  modifyOwnerDetails(){
    console.log("ModifyOwnerDetails");
  }

  changeOwner(){
    console.log("ChangeOwner");
  }

  getShownDogId() {
    //this.showDogId = this.showDogId ? this.showDogId : 54321;
    setTimeout(() => {
        console.log("Paused for 50 milliseconds"); // needed because showDogId is not immediately updated
        console.log('!Showing details for dogid', this.showDogId);
        if(this.showDogId==UNASSIGNED) {
          this.editStatus= true;
        }
    }, 50);

  }

}
