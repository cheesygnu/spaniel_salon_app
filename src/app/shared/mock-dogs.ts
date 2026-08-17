import { Dog } from "../models/dog.model";
import { UNASSIGNED_ID, ERROR_ID } from "./constants";
import { DOGGIEOWNERS, BLANK_OWNER} from "./mock-owners";

export const DOGGIES: Dog[] = [
  { dogid: 1, dogname: 'Kyla', breed: 'Cocker spaniel',mappedOwner: 4, dogPhotos: [], appointments: [
    {
      apptDate: "2025-12-23",
      groomType: "Feathers",
      price: 10,
      comment: "Stood still"
    },
    {
    apptDate: "2026-03-23",
      groomType: "Feathers",
      price: 20,
      comment: "Barked a lot"
    }
  ]
  },
  { dogid: 2, dogname: 'Tod', breed: 'Cocker spaniel',mappedOwner: 1, dogPhotos: [], appointments: [{
    apptDate: "2025-12-23",
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 3, dogname: 'Gnasher', breed:'', mappedOwner: 1, dogPhotos: [], appointments: [{
    apptDate: "2025-12-23",
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 4, dogname: 'Foo-Foo', breed:'', mappedOwner: 2, dogPhotos: [], appointments: [{
    apptDate: "2025-12-23",
    groomType: "Feathers",
    price: 10,
    comment: "Stood still"
    }]
  },
  { dogid: 5, dogname: 'Snowy', breed: 'Terrier',mappedOwner: 3, dogPhotos: [], appointments: [{
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
  breed: '',
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
  breed: '',
  mappedOwner: ERROR_ID,
  dogPhotos: [],
  appointments: [{
      apptDate: "1900-01-01",
      groomType: "ERROR",
      price: ERROR_ID,
      comment: "ERROR"
    }]
}
