import { Appointment } from "./appointment.model";

export interface DogPhoto {
  photoOrdinal: number;
  dogPhotoFilename: string;
}

export class Dog {
  dogid!: number;
  dogname!: string;
  mappedOwner!: number;
  appointments!: Appointment[];
  dogPhotos!: DogPhoto[];
}
