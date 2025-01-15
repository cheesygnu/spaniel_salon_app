import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DogOwner } from '../../models/dog-owner.model';
import { OwnerContactDetails } from '../../models/owner-contact-details.model';
import { BLANK_OWNER } from '../../shared/mock-owners';
import { ContactPhone } from '../../models/contact-phone.model';

@Component({
  selector: 'app-display-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './display-contact.component.html',
  styleUrl: './display-contact.component.css'
})



export class DisplayContactComponent {

  @Input() owner!: DogOwner;

  //allPhoneNumbers: ContactPhone[] = this.owner?.ownerContactDetails?.contactPhoneNumbers || [];

  constructor() {
    //console.log("** DogOwner ", this.owner);
    //console.log("allPhoneNumbers", this.allPhoneNumbers);
  }

  ngOnInit(){
    console.log("** DogOwner ", this.owner);
  }

}
