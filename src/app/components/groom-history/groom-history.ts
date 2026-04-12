import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dog } from '../../models/dog.model';

@Component({
  selector: 'app-groom-history',
  imports: [FormsModule],
  templateUrl: './groom-history.html',
  styleUrl: './groom-history.css',
})
export class GroomHistory {
  //model signal inputs passed by parent component
  displayedDog = model.required<Dog>();

}
