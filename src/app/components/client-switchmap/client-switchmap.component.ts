import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, of, Subject } from "rxjs";
import { catchError, switchMap, filter, map } from "rxjs/operators";
import { StarWarsApiService, StarWarsResult } from "../../services/swapi.service";
import { SearchInputComponent } from "../search-input/search-input.component";

@Component({
    selector: "app-client-switchmap",
    imports: [SearchInputComponent, CommonModule],
    templateUrl: "./client-switchmap.component.html",
    styleUrls: ["./client-switchmap.component.css"]
})
export class ClientSwitchmapComponent {
  searchTerm = new Subject<string>();
  results$: Observable<StarWarsResult> = this.searchTerm.pipe(
    switchMap(searchTerm => this.starWarsApiService.getResults(searchTerm)),
    filter((result): result is StarWarsResult => result !== null),
    map(result => result as StarWarsResult),
    catchError(errorResponse => {
      console.error(errorResponse);
      return of();
    })
  );

  constructor(private starWarsApiService: StarWarsApiService) {}

  onTextChange(changedText: string) {
    this.searchTerm.next(changedText);
  }
}

