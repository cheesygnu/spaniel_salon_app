import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

type LinkReference = string;
type DateString = string; // "2014-12-09T13:50:51.644000Z"

export interface StarWarsResultItem {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: LinkReference;
  films: LinkReference[];
  vehicles: LinkReference[];
  starships: LinkReference[];
  created: DateString;
  edited: DateString;
  url: LinkReference;
}

export interface StarWarsResultItem {}

// only partial type
export interface StarWarsResult {
  count: number;
  results: StarWarsResultItem[];
}

@Injectable({
  providedIn: 'root'
})
export class StarWarsApiService {
  constructor(private httpClient: HttpClient) {}

  getResults(searchTerm: string): Observable<StarWarsResult> {
    return this.httpClient.get<StarWarsResult>(
      "https://swapi.dev/api/people/?search=" + searchTerm
    );
  }
}

