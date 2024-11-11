import { Dog } from "../models/dog.model";
import { UNASSIGNED_ID } from "./constants";
import { DOGGIEOWNERS, BLANK_OWNER} from "./mock-owners";

export const DOGGIES: Dog[] = [
  { dogid: 1, dogname: 'Kyla', mappedOwner: 1 },
  { dogid: 2, dogname: 'Tod', mappedOwner: 1 },
  { dogid: 3, dogname: 'Gnasher', mappedOwner: 3 },
  { dogid: 4, dogname: 'Foo-Foo', mappedOwner: 4  },
  { dogid: 5, dogname: 'Snowy', mappedOwner: 5 },
];

export const BLANK_DOG: Dog = {
  dogid: UNASSIGNED_ID,
  dogname: '',
  mappedOwner: UNASSIGNED_ID
}
