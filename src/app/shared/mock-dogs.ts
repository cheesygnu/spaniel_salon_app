import { Dog } from "../models/dog.model";
import { DOGGIEOWNERS } from "./mock-owners";

export const DOGGIES: Dog[] = [
  { dogid: 1, dogname: 'Kyla', owner: DOGGIEOWNERS[0] },
  { dogid: 2, dogname: 'Tod', owner: DOGGIEOWNERS[0] },
  { dogid: 3, dogname: 'Gnasher', owner: DOGGIEOWNERS[1] },
  { dogid: 4, dogname: 'Foo-Foo', owner: DOGGIEOWNERS[2] },
  { dogid: 5, dogname: 'Snowy', owner: DOGGIEOWNERS[3] },
];
