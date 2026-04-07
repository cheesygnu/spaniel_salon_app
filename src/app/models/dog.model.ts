export interface Dog {
  dogid: number;
  dogname: string;
  mappedOwner: number;
  appointments: Appointment[];
  dogPhotos: DogPhoto[];
}

export interface DogPhoto {
  photoOrdinal: number;
  dogPhotoFilename: string;
}

export interface Appointment {
  //appointmentDateTime!: Date;
  groomType: string;
  price: number;
  comment: string;
}
