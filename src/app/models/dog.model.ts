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
  apptDate: string; //stored as a string in Firestore, converted to date within components
  groomType?: string;
  price: number;
  comment?: string;
  extraDesc?: string;
  extraPrice?: number;
}
