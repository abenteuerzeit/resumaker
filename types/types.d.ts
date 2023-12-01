// types.d.ts
import 'express';

type Address = {
  street: string;
  houseNumber: number;
  apartmentNumber: number;
  city: string;
  postalCode: number;
  country: string;
};

type Phone = {
  country: string;
  countryCode: number;
  number: number;
};

type SocialProfiles = {
  linkedIn: string;
  personalWebsite: string;
  github: string;
};

type PersonalData = {
  _id: string;
  name: string;
  address: Address;
  contact: {
    email: string;
    phones: Phone[];
  };
  socialProfiles: SocialProfiles;
};

declare module 'express-serve-static-core' {
  interface Request {
    personalData?: PersonalData;
  }
}
