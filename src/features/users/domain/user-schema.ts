export interface RegistrationData {
  userId: string;
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export interface User {
  id: string;
  email: string;
  login: string;
  createdAt: string;
  password: string;
}
