import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective} from '@ng-select/ng-select';
import { DogOwner } from '../../models/dog-owner.model';
import { DogCreatorService } from '../../services/dogcreator.service';

@Component({
    selector: 'app-search-autocomplete',
    imports: [NgSelectModule, FormsModule],
    templateUrl: './search-autocomplete.component.html'
})
export class SearchAutocompleteComponent {
  allExistingOwners!: DogOwner[];
  allOwnerSurnames: string[] =[];
  selectedExistingOwner:string="";

  constructor(private dogcreator: DogCreatorService) {
    this.loadDogOwners();
  }

  async loadDogOwners() {
    this.allExistingOwners = await this.dogcreator.getDogOwners();
    this.allOwnerSurnames = this.allExistingOwners.map(owner => owner.ownerSurname);
    console.log("Owner Surnames: ", this.allOwnerSurnames);
  }

 /*customSearchFn(term: string, item: DogOwner) {
    item.name = item.name.replace(',','');
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1;
}*/


}
