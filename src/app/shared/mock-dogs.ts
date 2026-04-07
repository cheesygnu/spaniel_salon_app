import { Dog } from "../models/dog.model";
import { UNASSIGNED_ID, ERROR_ID } from "./constants";
import { DOGGIEOWNERS, BLANK_OWNER} from "./mock-owners";

export const DOGGIES: Dog[] = [
  { dogid: 1, dogname: 'Kyla', mappedOwner: 0, dogPhotos: [], appointments: [{
      groomType: "Feathers",
      price: 10,
      comment: "Stood still"
    }]
  },
  { dogid: 2, dogname: 'Tod', mappedOwner: 1, dogPhotos: [], appointments: [{
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 3, dogname: 'Gnasher', mappedOwner: 1, dogPhotos: [], appointments: [{
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 4, dogname: 'Foo-Foo', mappedOwner: 2, dogPhotos: [], appointments: [{
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 5, dogname: 'Snowy', mappedOwner: 3, dogPhotos: [], appointments: [{
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
  }]
},
];

export const BLANK_DOG: Dog = {
  dogid: UNASSIGNED_ID,
  dogname: '',
  mappedOwner: UNASSIGNED_ID,
  dogPhotos: [],
  appointments: [{
      groomType: "",
      price: 0,
      comment: ""
    }]
}


export const ERROR_DOG: Dog = {
  dogid: ERROR_ID,
  dogname: "ERROR",
  mappedOwner: ERROR_ID,
  dogPhotos: [],
  appointments: [{
      //appointmentDateTime: new Date(1900, 12, 31, 0, 0),
      groomType: "ERROR",
      price: ERROR_ID,
      comment: "ERROR"
    }]
}
