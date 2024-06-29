import {Injectable} from "@angular/core";
import { DOGGIES } from "../shared/mock-dogs";

@Injectable({
   providedIn: 'root'
})

export class DogCreatorService {
  getDogs() {
    console.log("Hello");
    return Promise.resolve (DOGGIES);
  }
}
