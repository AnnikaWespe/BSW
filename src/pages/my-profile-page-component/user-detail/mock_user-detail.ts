import {UserDetail} from "./UserDetail";

export var MOCK_USER_DETAIL: UserDetail = {
  membership_data: {
    membership_number: "1234",
    salutation: "Frau",
    title: "",
    name: "Pippi",
    surname: "Langstrumpf",
    birthday: "1.1.1923",
    telephone_home: "1234",
    telephone_mobile: "123456",
    emailAdress: "pi@gmail.com",
    newsletter: "ja"
  },
  adress_data: {
    street: "Villa-Kunterbunt-Straße",
    number: "4",
    postal_code: "1234",
    city: "Lönneberga",
    district: "",
  },
  bankData: {
    account_number: "1234567",
    blz: "12345678",
    iban: "DE123434",
    swift: "GENODEM1GLS",
    bank_name: "GLS Bank",
  }
}
