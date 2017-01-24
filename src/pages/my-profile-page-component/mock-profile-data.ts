import {MyProfileData} from "./my-profile-data";

export var MOCK_PROFILE_DATA: MyProfileData = {
  memberData: {
    icon: "person",
    memberNumber : "1234",
    apellation: "Frau",
    title: "",
    firstName: "Pippi",
    lastName: "Langstrumpf",
    birthday: "1.1.1923",
    landlineNumber: "1234",
    mobileNumber: "123456",
  },
  adressData: {
    icon: "mail",
    street: "Villa-Kunterbunt-Straße",
    houseNumber: "4",
    zipCode: "1234",
    city: "Lönneberga",
    district: "",
  },
  passwordData: {
    icon: "star",
    password: "1234",
  },
  bankData: {
    icon: "card",
    accountNumber: "1234567",
    bankCode: "12345678",
    IBAN: "DE123434",
    BIC: "GENODEM1GLS",
    institute: "GLS Bank",
  }
}
