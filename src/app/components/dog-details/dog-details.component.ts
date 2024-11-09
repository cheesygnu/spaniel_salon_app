import { AfterViewInit, AfterContentInit, AfterViewChecked, Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { CommonModule, Location} from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";
import { UNASSIGNED_ID } from "../../shared/constants";
import { BLANK_DOG } from "../../shared/mock-dogs";
import { EnterContactComponent } from "../enter-contact/enter-contact.component";


@Component({
  selector: "app-dog-detail",
  standalone: true,
  imports: [CommonModule, FormsModule, EnterContactComponent],
  templateUrl: "./dog-details.component.html",
  styleUrls: ["./dog-details.component.css"]
})
export class DogDetailsComponent implements OnInit {

  @Input() chosenDog!: Dog;  //chosenDog is the dog which was selected from DogDirectory. This will be undefined if a new dog.

  public editStatus: boolean = false;
  public disabledStatus: boolean = !this.editStatus;
  public allOwnersInComponent: DogOwner[] = [];
  public assignedOwner!: DogOwner;
  public displayedDog: Dog = structuredClone(BLANK_DOG); // displayed dog is used within this component because chosenDog should not be chnaged until 'Save' is pressed



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
    //this.Value=this.MediaOptions[2];

    this.getdog();
    this.getAllOwners();

  }



  private async getdog(){
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.chosenDog = await this.dogCreatorservice.getDog(id);
      console.log("Chosen Dog: ", this.chosenDog );

      if(!this.chosenDog) {   // if chosenDog is undefined (i.e. a new Dog)
        this.editStatus= true;  // immediately go ito edit mode
      }
      else {
        this.displayedDog = structuredClone(this.chosenDog);
        //this.displayedDog = this.chosenDog; // update display dog from BLANK_DOG
      }
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
    }
    else {
      this.displayedDog = structuredClone(this.chosenDog);
    }

    console.log('Displayed Dog is now: ', this.displayedDog);
    console.log('Chosen Dog is now: ', this.chosenDog);
  }

  saveClicked(){
    console.log('Clicked Save');
    this.editStatus= !this.editStatus;
    this.disabledStatus = !this.disabledStatus;
    this.chosenDog = structuredClone(this.displayedDog)
    if(this.displayedDog.dogid==UNASSIGNED_ID){
      console.log ("Saving new dog", this.chosenDog.dogname);
      this.dogCreatorservice.createDog(this.chosenDog);
    }
    //this.modifyDogDetails(this.chosenDog);
  }

  modifyDogDetails(someDog: Dog){
    console.log("ModifyDogDetails");
    this.dogCreatorservice.modifyDog(someDog);
  }

  modifyOwnerDetails(){
    console.log("ModifyOwnerDetails");
  }

  changeOwner(){
    console.log("ChangeOwner");
  }


onDogNameChange() {

}


}
