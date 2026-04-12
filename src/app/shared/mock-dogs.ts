import { Dog } from "../models/dog.model";
import { UNASSIGNED_ID, ERROR_ID } from "./constants";
import { DOGGIEOWNERS, BLANK_OWNER} from "./mock-owners";

export const DOGGIES: Dog[] = [
  { dogid: 1, dogname: 'Kyla', mappedOwner: 0, dogPhotos: [], appointments: [{
      apptDate: "2025-12-23",
      groomType: "Feathers",
      price: 10,
      comment: "Stood still"
    }]
  },
  { dogid: 2, dogname: 'Tod', mappedOwner: 1, dogPhotos: [], appointments: [{
    apptDate: "2025-12-23",
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 3, dogname: 'Gnasher', mappedOwner: 1, dogPhotos: [], appointments: [{
    apptDate: "2025-12-23",
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 4, dogname: 'Foo-Foo', mappedOwner: 2, dogPhotos: [], appointments: [{
    apptDate: "2025-12-23",
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 5, dogname: 'Snowy', mappedOwner: 3, dogPhotos: [], appointments: [{
    apptDate: "2025-12-23",
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
    apptDate: "",
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
      apptDate: "1900-01-01",
      groomType: "ERROR",
      price: ERROR_ID,
      comment: "ERROR"
    }]
}
