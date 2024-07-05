import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DogCreatorService } from "../services/dogcreator.service";
import { CommonModule } from "@angular/common";
import { Dog } from "../models/dog.model";

@Component({
  selector: "app-dog-detail",
  standalone: true,
  imports: [CommonModule,],
  templateUrl: "./dog-details.component.html",
  styleUrls: ["./dog-details.component.css"]
})
export class DogDetailsComponent implements OnInit {
  //dog: any;
  @Input() dog?: Dog;

  constructor(private route: ActivatedRoute, private dogCreatorservice: DogCreatorService) {}

  ngOnInit() {
    this.getdogs();

    //dog = this.service.getDog(Number(this.route.snapshot.params['dogid']));
  }
  private getdogs(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
		this.dogCreatorservice.getDog(id).then(dog => (this.dog = dog));
    //   heroService.getHero(id).subscribe(hero => (this.hero = hero));
  }
}
