export interface DogOwner {
  ownerid: number;
  ownerSurname: string;
  ownerFirstName: string;
  ownerContactDetails: OwnerContactDetails;
  secondaryOwnerSurname?: string;
  secondaryOwnerFirstName?: string;
  secondaryOwnerContactDetails?: OwnerContactDetails;

}

export interface OwnerContactDetails {
  contactPhoneNumbers: ContactPhone[];
  contactEmailAddresses?: ContactEmail[];
}

export interface ContactPhone {
  phoneType: PhoneType;
  phoneNumber: string;
}
/*enum ContactType {
  EmailAddress = "Email Address",
  MobilePhoneNumber ="Mobile",
  Landline = "Landline",
  FacebookMessenger = "Facebook Messenger"
}*/

export interface ContactEmail {
  emailType: string;
  emailAddress: number;
}
/*enum ContactType {
  EmailAddress = "Email Address",
  MobilePhoneNumber ="Mobile",
  Landline = "Landline",
  FacebookMessenger = "Facebook Messenger"
}*/

export enum PhoneType {
  Landline = "Landline",
  Mobile = "Mobile",
  Other = "Other"
}
