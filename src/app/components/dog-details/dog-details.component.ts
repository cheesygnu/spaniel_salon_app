import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { CommonModule, Location} from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';
import { DogOwner } from "../../models/dog-owner.model";

@Component({
  selector: "app-dog-detail",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./dog-details.component.html",
  styleUrls: ["./dog-details.component.css"]
})
export class DogDetailsComponent implements OnInit {
  //dog: any;
  @Input() dogInput!: Dog;

  public editStatus: boolean = false;
  public disabledStatus: boolean = !this.editStatus;
  public allOwnersInComponent: DogOwner[] = [];
  public assignedOwner!: DogOwner;
  _displayedDogName!: string;
  _displayedOwnerSurname!: string;
  _selectedOwnerSurname!: string;

 get displayedDogName(): string {
  return this._displayedDogName;
}
set displayedDogName(value: string) {
  this._displayedDogName = value;
}

  get selectedOwnerSurname(): string {
    return this._selectedOwnerSurname;
  }
  set selectedOwnerSurname(value: string) {
    this._selectedOwnerSurname = value;
  }

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
    //this.assignedOwner=this.dogInput.owner.ownerSurname;
    //this.selectedOwnerSurname=this.assignedOwner;

    /*console.log("calling dogcreator");
    this.dogCreatorservice.getDogOwners()
      .then(allOwners => this.allOwnersInComponent = allOwners);*/

    //dog = this.service.getDog(Number(this.route.snapshot.params['dogid']));
  }
  private getdogs(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
		this.dogCreatorservice.getDog(id).then(dog => (this.dogInput = dog));
    this.dogCreatorservice.getDog(id).then(dog => (this.selectedOwnerSurname = dog.owner.ownerSurname));
    this.dogCreatorservice.getDog(id).then(dog => (this.displayedDogName = dog.dogname));
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
    this.editStatus= !this.editStatus;
    this.disabledStatus = !this.disabledStatus;
    if(!this.editStatus){
      this.dogInput.dogname = this.displayedDogName;
      this.dogInput.owner.ownerSurname = this.selectedOwnerSurname;
    }
  }


}
