import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DogOwner } from '../../models/dog-owner.model';
import { OwnerContactDetails } from '../../models/owner-contact-details.model';
import { BLANK_OWNER } from '../../shared/mock-owners';
import { ContactPhone, PhoneType } from '../../models/contact-phone.model';

@Component({
  selector: 'app-enter-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './enter-contact.component.html',
  styleUrl: './enter-contact.component.css'
})



export class EnterContactComponent {

  @Input() owner!: DogOwner;

  allPhoneNumbers: ContactPhone[] = this.owner?.ownerContactDetails?.contactPhoneNumbers || [];

  selectExistingOwner(){

  }

  addPhoneContact(){
    const dummyPhoneContact: ContactPhone = { phoneType: PhoneType.Other, phoneNumber: "" };
    this.allPhoneNumbers.push(dummyPhoneContact);
  }

  removePhoneContact(item:ContactPhone){
    const index = this.allPhoneNumbers.indexOf(item);
    if (index > -1) {
        this.allPhoneNumbers.splice(index, 1);
    }
    //delete this.allPhoneNumbers[item];
  }

}
