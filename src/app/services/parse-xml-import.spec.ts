import { TestBed } from '@angular/core/testing';

import { PhoneType } from '../models/dog-owner.model';
import { ParseXMLImport, XMLFileType } from './parse-xml-import';

describe('ParseXMLImport', () => {
  let service: ParseXMLImport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseXMLImport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parse', () => {

    // Sample XML in the same format as src/app/shared/dog4import.xml
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<dogs>
  <dog>
    <dogid>1</dogid>
    <dogname>Kyla</dogname>
    <breed>Cocker spaniel</breed>
    <mappedOwner>4</mappedOwner>
    <dogPhotos></dogPhotos>
    <appointments>
      <appointment>
        <apptDate>2025-12-23</apptDate>
        <groomType>Feathers</groomType>
        <price>10</price>
        <comment>Stood still</comment>
      </appointment>
      <appointment>
        <apptDate>2026-03-23</apptDate>
        <groomType>Feathers</groomType>
        <price>20</price>
        <comment>Barked a lot</comment>
      </appointment>
    </appointments>
  </dog>
  <dog>
    <dogid>2</dogid>
    <dogname>Tod</dogname>
    <breed>Cocker spaniel</breed>
    <mappedOwner>1</mappedOwner>
    <dogPhotos></dogPhotos>
    <appointments>
      <appointment>
        <apptDate>2025-12-23</apptDate>
        <groomType>Feathers</groomType>
        <price>10</price>
        <comment>Stood still</comment>
      </appointment>
    </appointments>
  </dog>
</dogs>`;

    it('recognises the XML as Dogs and parses the dogs', () => {
      const result = service.parse(sampleXml);

      expect(result.type).toBe(XMLFileType.Dogs);
      expect(result.dogs.length).toBe(2);
      expect(result.dogs[0].dogid).toBe(1);
      expect(result.dogs[0].dogname).toBe('Kyla');
      expect(result.dogs[0].breed).toBe('Cocker spaniel');
      expect(result.dogs[0].mappedOwner).toBe(4);
    });

    it('parses appointments for each dog', () => {
      const result = service.parse(sampleXml);

      expect(result.dogs[0].appointments.length).toBe(2);
      expect(result.dogs[0].appointments[0].apptDate).toBe('2025-12-23');
      expect(result.dogs[0].appointments[0].groomType).toBe('Feathers');
      expect(result.dogs[0].appointments[0].price).toBe(10);
      expect(result.dogs[0].appointments[0].comment).toBe('Stood still');
      expect(result.dogs[1].appointments.length).toBe(1);
    });

    it('parses an empty dogPhotos element as an empty array', () => {
      const result = service.parse(sampleXml);

      expect(result.dogs[0].dogPhotos).toEqual([]);
    });

    it('recognises an empty dogs list', () => {
      const result = service.parse('<dogs></dogs>');

      expect(result.type).toBe(XMLFileType.Dogs);
      expect(result.dogs).toEqual([]);
      expect(result.owners).toEqual([]);
    });

    it('recognises and parses a list of Dog Owners', () => {
      const ownerXml = `<?xml version="1.0" encoding="UTF-8"?>
<owners>
  <dogOwner>
    <ownerid>1</ownerid>
    <ownerSurname>Beer</ownerSurname>
    <ownerFirstName>Vanessa</ownerFirstName>
    <ownerContactDetails>
      <contactPhoneNumbers>
        <contactPhone>
          <phoneType>Mobile</phoneType>
          <phoneNumber>0777123123</phoneNumber>
        </contactPhone>
      </contactPhoneNumbers>
      <contactEmailAddresses>
        <contactEmail>
          <emailType>Home</emailType>
          <emailAddress>vanessa@example.com</emailAddress>
        </contactEmail>
      </contactEmailAddresses>
    </ownerContactDetails>
    <secondaryOwnerFirstName>Mark</secondaryOwnerFirstName>
    <secondaryOwnerSurname>Beer</secondaryOwnerSurname>
  </dogOwner>
  <dogOwner>
    <ownerid>2</ownerid>
    <ownerSurname>The Menace</ownerSurname>
    <ownerFirstName>Dennis</ownerFirstName>
    <ownerContactDetails>
      <contactPhoneNumbers>
        <contactPhone>
          <phoneType>Other</phoneType>
          <phoneNumber>0777123400</phoneNumber>
        </contactPhone>
      </contactPhoneNumbers>
      <contactEmailAddresses></contactEmailAddresses>
    </ownerContactDetails>
  </dogOwner>
</owners>`;

      const result = service.parse(ownerXml);

      expect(result.type).toBe(XMLFileType.DogOwners);
      expect(result.owners.length).toBe(2);
      expect(result.dogs).toEqual([]);
      expect(result.owners[0].ownerid).toBe(1);
      expect(result.owners[0].ownerFirstName).toBe('Vanessa');
      expect(result.owners[0].ownerSurname).toBe('Beer');
      expect(result.owners[0].ownerContactDetails.contactPhoneNumbers.length).toBe(1);
      expect(result.owners[0].ownerContactDetails.contactPhoneNumbers[0]).toEqual({
        phoneType: PhoneType.Mobile,
        phoneNumber: '0777123123'
      });
      expect(result.owners[0].ownerContactDetails.contactEmailAddresses).toEqual([
        { emailType: 'Home', emailAddress: 'vanessa@example.com' }
      ]);
      expect(result.owners[0].secondaryOwnerFirstName).toBe('Mark');
      expect(result.owners[0].secondaryOwnerSurname).toBe('Beer');
      expect(result.owners[1].ownerContactDetails.contactPhoneNumbers.length).toBe(1);
      expect(result.owners[1].ownerContactDetails.contactEmailAddresses).toBeUndefined();
    });

    it('recognises and parses a combined Dogs with Owners file', () => {
      const combinedXml = `<?xml version="1.0" encoding="UTF-8"?>
<dogsWithOwners>
  <dogsWithOwner>
    <dogOwner>
      <ownerId>1</ownerId>
      <ownerSurname>Beer</ownerSurname>
      <ownerFirstName>Vanessa</ownerFirstName>
      <ownerContactDetails>
        <contactPhoneNumbers>
          <contactPhone>
            <phoneType>Mobile</phoneType>
            <phoneNumber>0777123123</phoneNumber>
          </contactPhone>
        </contactPhoneNumbers>
      </ownerContactDetails>
    </dogOwner>
    <dog>
      <dogid>1</dogid>
      <dogname>Kyla</dogname>
      <breed>Cocker spaniel</breed>
      <mappedOwner>1</mappedOwner>
      <dogPhotos></dogPhotos>
      <appointments>
        <appointment>
          <apptDate>2025-12-23</apptDate>
          <price>10</price>
        </appointment>
      </appointments>
    </dog>
    <dog>
      <dogid>2</dogid>
      <dogname>Tod</dogname>
      <breed>Cocker spaniel</breed>
      <mappedOwner>1</mappedOwner>
    </dog>
  </dogsWithOwner>
</dogsWithOwners>`;

      const result = service.parse(combinedXml);

      expect(result.type).toBe(XMLFileType.DogsWithOwners);
      expect(result.dogs).toEqual([]);
      expect(result.owners).toEqual([]);
      expect(result.dogsWithOwners.length).toBe(1);

      const { owner, dogs } = result.dogsWithOwners[0];
      expect(owner.ownerid).toBe(1);
      expect(owner.ownerFirstName).toBe('Vanessa');
      expect(owner.ownerSurname).toBe('Beer');
      expect(owner.ownerContactDetails.contactPhoneNumbers[0].phoneNumber).toBe('0777123123');
      expect(dogs.length).toBe(2);
      expect(dogs[0].dogid).toBe(1);
      expect(dogs[0].dogname).toBe('Kyla');
      expect(dogs[0].appointments.length).toBe(1);
      expect(dogs[1].dogid).toBe(2);
      expect(dogs[1].dogname).toBe('Tod');
    });

    it('maps an unknown phone type to Other', () => {
      const ownerXml = `<owners>
  <dogOwner>
    <ownerid>9</ownerid>
    <ownerSurname>Doe</ownerSurname>
    <ownerFirstName>Jane</ownerFirstName>
    <ownerContactDetails>
      <contactPhoneNumbers>
        <contactPhone>
          <phoneType>Carrier Pigeon</phoneType>
          <phoneNumber>0123</phoneNumber>
        </contactPhone>
      </contactPhoneNumbers>
    </ownerContactDetails>
  </dogOwner>
</owners>`;

      const result = service.parse(ownerXml);

      expect(result.type).toBe(XMLFileType.DogOwners);
      expect(result.owners[0].ownerContactDetails.contactPhoneNumbers[0].phoneType).toBe(
        PhoneType.Other
      );
    });

    it('flags an unrecognised XML file', () => {
      const result = service.parse('<cats><cat><name>Whisk</name></cat></cats>');

      expect(result.type).toBe(XMLFileType.Unrecognised);
      expect(result.dogs).toEqual([]);
      expect(result.owners).toEqual([]);
    });

    it('throws an error for invalid XML', () => {
      expect(() => service.parse('<dogs><dog></dogs>')).toThrowError(
        /does not contain valid XML/
      );
    });
  });
});
