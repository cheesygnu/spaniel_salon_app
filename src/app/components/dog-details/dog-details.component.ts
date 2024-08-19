import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DogCreatorService } from "../../services/dogcreator.service";
import { CommonModule, Location} from "@angular/common";
import { Dog } from "../../models/dog.model";
import { FormsModule } from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute,
    private dogCreatorservice: DogCreatorService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.getdogs();

    //dog = this.service.getDog(Number(this.route.snapshot.params['dogid']));
  }
  private getdogs(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
		this.dogCreatorservice.getDog(id).then(dog => (this.dog = dog));
    //   heroService.getHero(id).subscribe(hero => (this.hero = hero));
  }

  backClicked() {
    console.log('Clicked Back');
    this.location.back();
  }

  editClicked(){
    console.log('Clicked Edit');
    this.editStatus= !this.editStatus;
  }

 
}
