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
  @Input() dog?: Dog;

  public editStatus: boolean = false;
  public disabledStatus: boolean = !this.editStatus;
  public allOwnersInComponent: DogOwner[] = [];

  private _selectedOwner =this.allOwnersInComponent[2];

  public set Valuev(myselectedOwner: DogOwner){
    this._selectedOwner = myselectedOwner;
  }

  public get Value(): DogOwner {
    return this._selectedOwner;
  }

  constructor(
    private route: ActivatedRoute,
    private dogCreatorservice: DogCreatorService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.getdogs();
    this.getAllOwners();

    
      /*console.log("calling dogcreator");
      this.dogCreatorservice.getDogOwners()
        .then(allOwners => this.allOwnersInComponent = allOwners);*/
    
    
    

    //dog = this.service.getDog(Number(this.route.snapshot.params['dogid']));
  }
  private getdogs(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
		this.dogCreatorservice.getDog(id).then(dog => (this.dog = dog));
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
  }

 
}
