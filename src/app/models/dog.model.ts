import { Appointment } from "./appointment.model";

//import { DogOwner } from "./dog-owner.model";
export class Dog {
  dogid!: number;
  dogname!: string;
  mappedOwner!: number;
  appointments!: Appointment[];
}
