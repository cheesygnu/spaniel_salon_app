import { Component, EventEmitter, Output} from '@angular/core';
//import { ClientSwitchmapComponent } from '../client-switchmap/client-switchmap.component';
import { SearchAutocompleteComponent } from "../search-autocomplete/search-autocomplete.component";

@Component({
    selector: 'app-owner-search',
    //imports: [ClientSwitchmapComponent, SearchAutocompleteComponent],
    imports: [SearchAutocompleteComponent],
    templateUrl: './owner-search.component.html',
    styleUrl: './owner-search.component.css'
})
export class OwnerSearchComponent {

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
	this.close.emit();
  }

/*  closeDialog() {
    const dialog = document.querySelector('dialog');
    if (dialog) {
      dialog.close();
    }
  }*/
}
