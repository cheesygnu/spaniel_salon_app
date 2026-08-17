import { Injectable } from '@angular/core';
import { Appointment, Dog, DogPhoto } from '../models/dog.model';
import {
  ContactEmail,
  ContactPhone,
  DogOwner,
  OwnerContactDetails,
  PhoneType,
} from '../models/dog-owner.model';
import { DogsWithOwner } from '../models/dogs-with-owners.model';

/** The recognised kind of XML file that this service can parse. */
export enum XMLFileType {
  Dogs = 'Dogs',
  DogOwners = 'DogOwners',
  DogsWithOwners = 'DogsWithOwners',
  Unrecognised = 'UNRECOGNISED XML FILE',
}

/** Result of parsing an XML file: the recognised type plus the parsed data. */
export interface XMLImportResult {
  type: XMLFileType;
  dogs: Dog[];
  owners: DogOwner[];
  dogsWithOwners: DogsWithOwner[];
}

@Injectable({
  providedIn: 'root',
})
export class ParseXMLImport {

  /**
   * Parses an XML string and determines whether it contains a list of Dogs
   * (<dogs><dog>...</dog></dogs>), a list of Dog Owners
   * (<dogOwners><dogOwner>...</dogOwner></dogOwners>), a combined list of Dogs
   * with their Owners
   * (<dogsWithOwners><dogsWithOwner>...</dogsWithOwner></dogsWithOwners>),
   * or neither.
   *
   * For a Dogs file the parsed dogs are returned in `result.dogs`; for a Dog
   * Owners file the parsed owners are returned in `result.owners`; for a Dogs
   * with Owners file each { owner, dogs } entry is returned in
   * `result.dogsWithOwners`; for an unrecognised file all arrays are empty and
   * `result.type` is XMLFileType.Unrecognised.
   */
  parse(xmlString: string): XMLImportResult {
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');

    if (doc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('The file does not contain valid XML.');
    }

    switch (this.recognise(doc)) {
      case XMLFileType.Dogs:
        return { type: XMLFileType.Dogs, dogs: this.parseDogs(doc), owners: [], dogsWithOwners: [] };
      case XMLFileType.DogOwners:
        return { type: XMLFileType.DogOwners, dogs: [], owners: this.parseOwners(doc), dogsWithOwners: []};
      case XMLFileType.DogsWithOwners:
        return { type: XMLFileType.DogsWithOwners, dogs: [], owners: [], dogsWithOwners: this.parseDogsWithOwners(doc)};
      case XMLFileType.Unrecognised:
      default:
        return { type: XMLFileType.Unrecognised, dogs: [], owners: [], dogsWithOwners: [] };
    }
  }

  /**
   * Works out whether the document is a list of dogs, a list of owners, or a
   * combined list of dogs with their owners, preferring the root element name
   * and falling back to the presence of <dog> / <dogOwner> / <dogsWithOwner>
   * descendant elements.
   */
  private recognise(doc: Document): XMLFileType {
    const rootName = doc.documentElement?.tagName.toLowerCase();
    const hasDogElements = doc.getElementsByTagName('dogs').length > 0;
    const hasOwnerElements = doc.getElementsByTagName('dogOwners').length > 0;
    const hasDogsWithOwnerElements =
      doc.getElementsByTagName('dogsWithOwner').length > 0;

    if (
      rootName === 'dogsWithOwners' ||
      (rootName !== 'dogs' && rootName !== 'owners' && hasDogsWithOwnerElements)
    ) {
      return XMLFileType.DogsWithOwners;
    }
    if (rootName === 'dogs' || (rootName !== 'owners' && hasDogElements)) {
      return XMLFileType.Dogs;
    }
    if (rootName === 'owners' || (rootName !== 'dogs' && hasOwnerElements)) {
      return XMLFileType.DogOwners;
    }
    return XMLFileType.Unrecognised;
  }

  private parseDogs(doc: Document): Dog[] {
    const dogs: Dog[] = [];
    for (const dogElement of Array.from(doc.getElementsByTagName('dog'))) {
      dogs.push(this.parseDog(dogElement));
    }
    return dogs;
  }

  private parseDogsWithOwners(doc: Document): DogsWithOwner[] {
    const dogsWithOwners: DogsWithOwner[] = [];
    for (const groupElement of Array.from(
      doc.getElementsByTagName('dogsWithOwner')
    )) {
      dogsWithOwners.push(this.parseDogsWithOwner(groupElement));
    }
    return dogsWithOwners;
  }

  /**
   * Parses a single <dogsWithOwner> element, which contains one <dogOwner>
   * element followed by the <dog> elements that belong to that owner, into a
   * DogsWithOwner holding the owner and the dogs that belong to them.
   */
  private parseDogsWithOwner(dogsWithOwnerElement: Element): DogsWithOwner {
    const ownerElement = this.child(dogsWithOwnerElement, 'dogOwner');
    // A <dogsWithOwner> group always contains a <dogOwner> child.
    const owner = this.parseOwner(ownerElement!);

    const dogs: Dog[] = [];
    for (const element of Array.from(dogsWithOwnerElement.children)) {
      if (element.tagName.toLowerCase() !== 'dog') continue;
      dogs.push(this.parseDog(element));
    }

    return { owner, dogs };
  }

  private parseOwners(doc: Document): DogOwner[] {
    const owners: DogOwner[] = [];
    for (const ownerElement of Array.from(doc.getElementsByTagName('dogOwner'))) {
      owners.push(this.parseOwner(ownerElement));
    }
    return owners;
  }

  private parseDog(dogElement: Element): Dog {
    return {
      dogid: this.numberOf(this.child(dogElement, 'dogid')),
      dogname: this.textOf(this.child(dogElement, 'dogname')),
      breed: this.textOf(this.child(dogElement, 'breed')),
      mappedOwner: this.numberOf(this.child(dogElement, 'mappedOwner')),
      dogPhotos: this.parseDogPhotos(dogElement),
      appointments: this.parseAppointments(dogElement),
    };
  }

  private parseOwner(ownerElement: Element): DogOwner {
    const owner: DogOwner = {
      ownerid: this.numberOf(this.child(ownerElement, 'ownerId')),
      ownerSurname: this.textOf(this.child(ownerElement, 'ownerSurname')),
      ownerFirstName: this.textOf(this.child(ownerElement, 'ownerFirstName')),
      ownerContactDetails: this.parseContactDetails(
        this.child(ownerElement, 'ownerContactDetails')
      ),
    };

    const secondarySurname = this.optionalTextOf(
      this.child(ownerElement, 'secondaryOwnerSurname')
    );
    const secondaryFirstName = this.optionalTextOf(
      this.child(ownerElement, 'secondaryOwnerFirstName')
    );
    if (secondarySurname !== undefined) {
      owner.secondaryOwnerSurname = secondarySurname;
    }
    if (secondaryFirstName !== undefined) {
      owner.secondaryOwnerFirstName = secondaryFirstName;
    }
    const secondaryContactDetails = this.child(
      ownerElement,
      'secondaryOwnerContactDetails'
    );
    if (secondaryContactDetails) {
      owner.secondaryOwnerContactDetails = this.parseContactDetails(
        secondaryContactDetails
      );
    }

    return owner;
  }

  private parseContactDetails(container: Element | null): OwnerContactDetails {
    const contact: OwnerContactDetails = { contactPhoneNumbers: [] };

    const phoneNumbers = this.child(container, 'contactPhoneNumbers');
    if (phoneNumbers) {
      for (const element of Array.from(phoneNumbers.children)) {
        if (element.tagName.toLowerCase() !== 'contactphone') continue;

        const phone: ContactPhone = {
          phoneType: this.phoneTypeOf(this.child(element, 'phoneType')),
          phoneNumber: this.textOf(this.child(element, 'phoneNumber')),
        };
        contact.contactPhoneNumbers.push(phone);
      }
    }

    const emailAddresses = this.child(container, 'contactEmailAddresses');
    if (emailAddresses) {
      const emails: ContactEmail[] = [];
      for (const element of Array.from(emailAddresses.children)) {
        if (element.tagName.toLowerCase() !== 'contactemail') continue;

        emails.push({
          emailType: this.textOf(this.child(element, 'emailType')),
          emailAddress: this.textOf(this.child(element, 'emailAddress')),
        });
      }
      if (emails.length > 0) {
        contact.contactEmailAddresses = emails;
      }
    }

    return contact;
  }

  private parseAppointments(dogElement: Element): Appointment[] {
    const container = this.child(dogElement, 'appointments');
    if (!container) return [];

    const appointments: Appointment[] = [];
    for (const element of Array.from(container.children)) {
      if (element.tagName.toLowerCase() !== 'appointment') continue;

      appointments.push({
        apptDate: this.textOf(this.child(element, 'apptDate')),
        groomType: this.optionalTextOf(this.child(element, 'groomType')),
        price: this.numberOf(this.child(element, 'price')),
        comment: this.optionalTextOf(this.child(element, 'comment')),
        extraDesc: this.optionalTextOf(this.child(element, 'extraDesc')),
        extraPrice: this.optionalNumberOf(this.child(element, 'extraPrice')),
      });
    }
    return appointments;
  }

  private parseDogPhotos(dogElement: Element): DogPhoto[] {
    const container = this.child(dogElement, 'dogPhotos');
    if (!container) return [];

    const dogPhotos: DogPhoto[] = [];
    for (const element of Array.from(container.children)) {
      if (element.tagName.toLowerCase() !== 'dogphoto') continue;

      dogPhotos.push({
        photoOrdinal: this.numberOf(this.child(element, 'photoOrdinal')),
        dogPhotoFilename: this.textOf(this.child(element, 'dogPhotoFilename')),
      });
    }
    return dogPhotos;
  }

  private child(parent: Element | null, tagName: string): Element | null {
    if (!parent) return null;
    for (const element of Array.from(parent.children)) {
      if (element.tagName.toLowerCase() === tagName.toLowerCase()) {
        return element;
      }
    }
    return null;
  }

  private textOf(element: Element | null): string {
    return element?.textContent?.trim() ?? '';
  }

  private optionalTextOf(element: Element | null): string | undefined {
    const text = this.textOf(element);
    return text === '' ? undefined : text;
  }

  private numberOf(element: Element | null): number {
    return Number(this.textOf(element)) || 0;
  }

  private optionalNumberOf(element: Element | null): number | undefined {
    const text = this.textOf(element);
    return text === '' ? undefined : Number(text) || 0;
  }

  private phoneTypeOf(element: Element | null): PhoneType {
    const text = this.textOf(element);
    return (Object.values(PhoneType) as string[]).includes(text)
      ? (text as PhoneType)
      : PhoneType.Other;
  }
}
