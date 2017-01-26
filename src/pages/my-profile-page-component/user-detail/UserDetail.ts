
export class UserDetail{
  membership_data: {
    membership_number: string;
    salutation: string;
    title: string;
    name: string;
    surname: string;
    birthday: string;
    telephone_home: string;
    telephone_mobile: string;
    emailAdress: string;
    newsletter: string;
  };
  adress_data: {
    street: string;
    number: string;
    postal_code: string;
    city: string;
    district: string;
  };
  bankData: {
    account_number: string;
    blz: string;
    iban: string;
    swift: string;
    bank_name: string;
  };
}
