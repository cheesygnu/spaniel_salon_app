import { Dog } from "../models/dog.model";
import { UNASSIGNED_ID } from "./constants";
import { DOGGIEOWNERS, BLANK_OWNER} from "./mock-owners";

export const DOGGIES: Dog[] = [
  { dogid: 1, dogname: 'Kyla', owner: 0 },
  { dogid: 2, dogname: 'Tod', owner: 1 },
  { dogid: 3, dogname: 'Gnasher', owner: 1 },
  { dogid: 4, dogname: 'Foo-Foo', owner: 2 },
  { dogid: 5, dogname: 'Snowy', owner: 3 },
];

export const BLANK_DOG: Dog = {
  dogid: UNASSIGNED_ID,
  dogname: '',
  owner: 991
}
