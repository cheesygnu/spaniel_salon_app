import { Dog } from "../models/dog.model";
import { UNASSIGNED_ID } from "./constants";
import { DOGGIEOWNERS, BLANK_OWNER} from "./mock-owners";

export const DOGGIES: Dog[] = [
  { dogid: 1, dogname: 'Kyla', owner: DOGGIEOWNERS[0] },
  { dogid: 2, dogname: 'Tod', owner: DOGGIEOWNERS[0] },
  { dogid: 3, dogname: 'Gnasher', owner: DOGGIEOWNERS[1] },
  { dogid: 4, dogname: 'Foo-Foo', owner: DOGGIEOWNERS[2] },
  { dogid: 5, dogname: 'Snowy', owner: DOGGIEOWNERS[3] },
];

export const BLANK_DOG: Dog = {
  dogid: UNASSIGNED_ID,
  dogname: '',
  owner: BLANK_OWNER
}
