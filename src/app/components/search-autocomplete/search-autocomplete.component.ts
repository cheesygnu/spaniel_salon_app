import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective} from '@ng-select/ng-select';

interface City {
    id: number;
    name: string;
    // Add other properties if needed
}

@Component({
  selector: 'app-search-autocomplete',
  standalone: true,
  imports: [NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, FormsModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css'

})
export class SearchAutocompleteComponent {
  cities = [
    {id: 1, name: 'MA, Boston'},
    {id: 2, name: 'FL, Miami'},
    {id: 3, name: 'NY, New York', disabled: true},
    {id: 4, name: 'CA, Los Angeles'},
    {id: 5, name: 'TX, Dallas'}
];

selectedCity!:City

 customSearchFn(term: string, item: City) {
    item.name = item.name.replace(',','');
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1;
}


}
