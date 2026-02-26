import { Component, Input, signal, model, ModelSignal, computed } from '@angular/core';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { FormsModule } from '@angular/forms';
import { DogOwner } from '../../models/dog-owner.model';
import { OwnerContactDetails } from '../../models/owner-contact-details.model';
import { BLANK_OWNER } from '../../shared/mock-owners';
import { ContactPhone, PhoneType } from '../../models/contact-phone.model';
import { OwnerSearchComponent } from '../owner-search/owner-search.component';
import { SearchAutocompleteComponent } from "../search-autocomplete/search-autocomplete.component";

@Component({
    selector: 'app-enter-contact',
    imports: [FormsModule, OwnerSearchComponent, SearchAutocompleteComponent],
    templateUrl: './enter-contact.component.html',
    styleUrl: './enter-contact.component.css'
})



export class EnterContactComponent {

 //model signal inputs passed by parent component
  displayedOwner = model.required<DogOwner>();
  editStatus = model.required<boolean>();
  labels = model.required<{firstName: string, surname: string}>();
  labelColourFirstName = computed(() => this.labels().firstName !== "First Name" ? "red" : "");
  labelColourSurname = computed(() => this.labels().surname !== "Surname" ? "red" : "");

  allPhoneNumbers: ContactPhone[] =[];
  //allPhoneNumbers = computed(() => this.displayedOwner().ownerContactDetails.contactPhoneNumbers);
  allPhoneTypes: PhoneType[] = Object.values(PhoneType);
  isExistingOwnerModalVisible: boolean = false;
  ownerIsExistingOwner = signal<boolean>(false);

  constructor(){
    explicitEffect([this.displayedOwner], ([displayedOwner]) => {
      console.log("EFFECT: displayedOwner: ", displayedOwner);
      this.allPhoneNumbers = displayedOwner.ownerContactDetails?.contactPhoneNumbers;
    });
  }

  ngOnInit() {
    console.log("ngOnInit in Enter-contact. Owner is ", this.displayedOwner().ownerFirstName, "allPhoneNumbers: ", this.allPhoneNumbers);
  }

  /*ngOnChanges() {
    this.allPhoneNumbers = this.owner?.ownerContactDetails?.contactPhoneNumbers || [];
    console.log("Owner is ", this.owner.ownerFirstName, "allPhoneNumbers: ", this.allPhoneNumbers);
  }*/

  selectExistingOwner(){
    this.isExistingOwnerModalVisible = true;
  }

  hideModal() {
    this.isExistingOwnerModalVisible = false;
    }

  addPhoneContact(){
    const dummyPhoneContact: ContactPhone = { phoneType: PhoneType.Mobile, phoneNumber: "" };
    this.allPhoneNumbers.push(dummyPhoneContact);

    // Update the owner's contactPhoneNumbers as well, if structure permits
    const currentOwner = this.displayedOwner();
      currentOwner.ownerContactDetails.contactPhoneNumbers = [...this.allPhoneNumbers];
      this.displayedOwner.set({ ...currentOwner });
    console.log("Owner is ", this.displayedOwner().ownerFirstName, "allPhoneNumbers: ", this.allPhoneNumbers);
  }

  removePhoneContact(item:ContactPhone){
    const index = this.allPhoneNumbers.indexOf(item);
    if (index > -1) {
        this.allPhoneNumbers.splice(index, 1);
        const currentOwner = this.displayedOwner();
        currentOwner.ownerContactDetails.contactPhoneNumbers = [...this.allPhoneNumbers];
        this.displayedOwner.set({ ...currentOwner });

    }
    //delete this.allPhoneNumbers[item];
  }

}
