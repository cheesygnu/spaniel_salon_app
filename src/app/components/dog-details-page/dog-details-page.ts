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

}
