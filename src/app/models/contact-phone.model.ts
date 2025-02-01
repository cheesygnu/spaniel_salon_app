export class ContactPhone {
  phoneType!: PhoneType;
  phoneNumber !: string;
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
