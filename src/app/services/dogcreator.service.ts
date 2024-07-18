import {Injectable} from "@angular/core";
import { DOGGIES } from "../shared/mock-dogs";

@Injectable({
   providedIn: 'root'
})

export class DogCreatorService {
  getDogs() {
    console.log("DogCreatorService: Getting list of dogs");
    return Promise.resolve (DOGGIES);
  }
  getDog(id: number){
    return Promise.resolve (DOGGIES).then(
      dogs => dogs.filter(dog=> dog.dogid === id)[0]
    );
  }
}
