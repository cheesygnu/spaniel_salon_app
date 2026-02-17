import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DogDetailsComponent } from '../dog-details/dog-details.component';
import { BLANK_DOG, ERROR_DOG } from '../../shared/mock-dogs';



@Component({
  selector: 'app-dog-details-page',
  imports: [DogDetailsComponent],
  templateUrl: './dog-details-page.html',
  styleUrl: './dog-details-page.css',
})
export class DogDetailsPage {
/*This component handles routing from dog-directory to dog-details.
It means that the dog-details component is always passed dogid,
making dog-details simplerand less error prone
 */

  constructor(
    private route: ActivatedRoute,
  ){}

  /*ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('id');
    console.log("route id in dog-details: ", routeId);
    if (routeId){
      if (routeId === "new") {   // new dog
        console.log("route id associated with NEW dog: ", routeId);
        this.chosenDogId = BLANK_DOG.dogid
      }
      else { // existing dog
        this.chosenDogId = Number(routeId);
      }
    }
    else {
    // Handle the case where routeId is unexpectedly null
    console.error("Error: routeId is null in DogDetailsPage. This should not happen.");
    throw new Error("DogDetailsPage: routeId is null. Unable to load dog details.");
    }
  }*/

}
