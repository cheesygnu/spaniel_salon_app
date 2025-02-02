import { Component, EventEmitter, Output} from '@angular/core';
import { ClientSwitchmapComponent } from '../client-switchmap/client-switchmap.component';

@Component({
  selector: 'app-owner-search',
  standalone: true,
  imports: [ClientSwitchmapComponent],
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
