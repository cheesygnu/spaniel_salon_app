import { Component, Input, signal, model, ModelSignal, computed } from '@angular/core';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { FormsModule } from '@angular/forms';
import { DogCreatorService } from '../../services/dogcreator.service';
import { Dog } from '../../models/dog.model';
import { DogOwner, OwnerContactDetails, ContactPhone, PhoneType, ContactEmail } from '../../models/dog-owner.model';
import { BLANK_OWNER } from '../../shared/mock-owners';

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
  displayedDog = model.required<Dog>();
  displayedOwner = model.required<DogOwner>();
  editStatus = model.required<boolean>();
  ownerIsExistingOwner = model.required<boolean>();

  labels = model.required<{firstName: string, surname: string}>();
  labelColourFirstName = computed(() => this.labels().firstName !== "First Name" ? "red" : "");
  labelColourSurname = computed(() => this.labels().surname !== "Surname" ? "red" : "");

  allPhoneNumbers: ContactPhone[] =[];
  //allPhoneNumbers = computed(() => this.displayedOwner().ownerContactDetails.contactPhoneNumbers);
  allPhoneTypes: PhoneType[] = Object.values(PhoneType);
  existingOwner: string = "";
  allOwners: DogOwner[] = [];
  origOwnerBeforeSelectExisting!: DogOwner; // used to store original owner so can restore when required


  get filteredDatalistOwners(): DogOwner[] {
    const term = this.existingOwner.trim().toLowerCase();
    if (term === '') return [];
    return this.allOwners
      .filter(
        (o) =>
          `${o.ownerFirstName} ${o.ownerSurname}`.toLowerCase().includes(term) ||
          `${o.ownerSurname} ${o.ownerFirstName}`.toLowerCase().includes(term)
      )
      .slice(0, 4);
  }
  //isExistingOwnerModalVisible: boolean = false;
  //ownerIsExistingOwner = signal<boolean>(false);

  constructor(
    private dogCreatorService: DogCreatorService
  ){
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

  async onOwnerIsExistingOwnerChange(value: boolean) {
    this.ownerIsExistingOwner.set(value);
    if (value) {
      this.allOwners = await this.dogCreatorService.getDogOwners();
      this.origOwnerBeforeSelectExisting = this.displayedOwner(); // stores original owner
    }
    else{
      this.displayedOwner.set(this.origOwnerBeforeSelectExisting); // restores original owner when deselecting existingOwner
      this.existingOwner = ""; // initialises existingOwner within search input
    }
  }

  onExistingOwnerInput() {
    const value = this.existingOwner.trim();
    if (value === '') return;
    const match = this.allOwners.find(
      (o) =>
        `${o.ownerSurname} ${o.ownerFirstName}` === value ||
        `${o.ownerFirstName} ${o.ownerSurname}` === value
    );
    if (match) {
      const dog = this.displayedDog();
      this.displayedDog.set({ ...dog, mappedOwner: match.ownerid });
      this.displayedOwner.set(structuredClone(match));
    }
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
