import { Component } from '@angular/core';
import { DogCreatorService } from '../../services/dogcreator.service';
import { DOGGIEOWNERS } from '../../shared/mock-owners';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

  constructor(private dogCreator: DogCreatorService){

  console.log("Appointment generating owner");
  this.dogCreator.createOwner(DOGGIEOWNERS[0]);

  }

}
